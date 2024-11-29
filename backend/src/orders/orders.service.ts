import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Orders } from './entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Age } from 'src/age/entities/age.entity';
import { TourPrice } from 'src/tourprice/entities/tourprice.entity';
import { Tour } from 'src/tour/entities/tour.entity';
import { Cusinfo } from 'src/cusinfo/entities/cusinfo.entity';
import { OrderDetail } from 'src/orderdetail/entities/orderdetail.entity';

@Injectable()
export class OrdersService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async createOrder(adult: any[], children: any[], babies: any[], tour: number, userid: number, totalquantity: number, totalPrice: number) {
    return await this.entityManager.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { userid: userid } });
      console.log(totalquantity);
      try {
        let orderCode = Math.floor(100000 + Math.random() * 900000);
        let existingOrder = await manager.findOne(Orders, { where: { ordercode: orderCode } });

        while (existingOrder) {
          orderCode = Math.floor(100000 + Math.random() * 900000);
          existingOrder = await manager.findOne(Orders, { where: { ordercode: orderCode } });
        }
        const order = manager.create(Orders, {
          ordercode: Math.floor(100000 + Math.random() * 900000),
          orderdate: new Date(),
          totalquantity: totalquantity,
          totalprice: totalPrice,
          condition: 'Pending',
          user: user,
          isseen: 'False'
        });

        const savedOrder = await manager.save(order);



        const addCustomerInfoAndGetPrice = async (customerData: any, role: string, tourId: number) => {
          console.log(role);
          const ageGroup = await manager.findOne(Age, {
            where: {
              agegroup: role,
            },
          });

          if (!ageGroup) {
            throw new Error(`No age group found for role: ${role}`);
          }

          const tour = await manager.findOne(Tour, { where: { tourid: tourId } });

          const tourPrice = await manager.findOne(TourPrice, {
            where: {
              tour: tour,
              age: ageGroup,
            },
          });

          if (!tourPrice) {
            throw new Error(`No tour price found for the tour (${tourId}) and age group (${role})`);
          }

          const customerInfo = manager.create(Cusinfo, {
            cusname: customerData.fullName,
            cusphone: customerData.phone,
            cusadd: customerData.address,
            cusgen: customerData.email,
            cusnation: customerData.nation,
            cuspp: customerData.passport
          });

          const saveCustomerInfo = await manager.save(customerInfo);

          return { customerInfo: saveCustomerInfo, tourPrice: tourPrice }
        };

        const adultInfos = await Promise.all(adult.map(adult => addCustomerInfoAndGetPrice(adult, 'adult', tour)));
        const childrenInfos = await Promise.all(children.map(child => addCustomerInfoAndGetPrice(child, 'children', tour)));
        const babyInfos = await Promise.all(babies.map(baby => addCustomerInfoAndGetPrice(baby, 'baby', tour)));

        const createOrderDetail = async (orderid: number, customerInfo: number, tourPriceId: number) => {
          const orders = await manager.findOne(Orders, { where: { orderid: orderid } });
          const tourprice = await manager.findOne(TourPrice, { where: { tourpriceid: tourPriceId } });
          const customer = await manager.findOne(Cusinfo, { where: { cusinfoid: customerInfo } });

          const orderDetail = manager.create(OrderDetail, {
            order: orders,
            tourPrice: tourprice,
            cusinfo: customer
          });
          return await manager.save(orderDetail);
        };

        await Promise.all(adultInfos.map(info => createOrderDetail(savedOrder.orderid, info.customerInfo.cusinfoid, info.tourPrice.tourpriceid)));

        await Promise.all(childrenInfos.map(info => createOrderDetail(savedOrder.orderid, info.customerInfo.cusinfoid, info.tourPrice.tourpriceid)));

        await Promise.all(babyInfos.map(info => createOrderDetail(savedOrder.orderid, info.customerInfo.cusinfoid, info.tourPrice.tourpriceid)));

        return savedOrder;
      } catch (error) {
        console.error('Error creating order:', error.message);
        throw new Error('Failed to create order');
      }
    })
  }

  async findAllOrder(userid: number) {
    return await this.entityManager
      .createQueryBuilder(Orders, 'order')
      .where('order.userid = :userid', { userid })
      .getMany();
  }

  async findAllOrderCount() {
    return await this.entityManager
      .createQueryBuilder(Orders, 'o')
      .getCount();
  }

  async sumRevenue() {
    return await this.entityManager
      .createQueryBuilder(Orders, 'o')
      .select('EXTRACT(YEAR FROM o.orderdate) AS year')
      .addSelect('SUM(o.totalprice) AS totalRevenue')
      .groupBy('EXTRACT(YEAR FROM o.orderdate)')
      .orderBy('year', 'ASC')
      .getRawMany();
  }

  async findAllOrderAndUser() {
    return await this.entityManager
      .createQueryBuilder(Orders, 'o')
      .innerJoinAndSelect('o.user', 'u')
      .getMany();
  }

  async findOrderByOrderCode(ordercode: string) {
    return await this.entityManager
      .createQueryBuilder(Orders, 'o')
      .innerJoinAndSelect('o.user', 'u')
      .where('CAST(o.ordercode AS TEXT) LIKE :ordercode', { ordercode: `%${ordercode}%` })
      .getMany();
  }

  async findManageAllOrder() {
    return await this.entityManager
      .createQueryBuilder(Orders, 'o')
      .getMany();
  }

  async findManagePendingOrder(status: string) {
    return await this.entityManager
      .createQueryBuilder(Orders, 'o')
      .where('o.condition =:status', { status })
      .getMany();
  }

  async findManageOneOrder(orderid: number) {
    return await this.entityManager
      .createQueryBuilder(Orders, 'o')
      .where('o.orderid =:orderid', { orderid })
      .getOne();
  }

  async updateStatus(orderid: number, condition: string) {
    return await this.entityManager.transaction(async (manager) => {
      const order = await manager.findOne(Orders, { where: { orderid: orderid } });
      if (order) {
        await manager.update(Orders, order.orderid, {
          condition: condition
        });
        return { success: true, message: 'Updated Condition Order successfully' };
      } else {
        return { success: false, message: 'OrderId don\'t exist' };
      }
    });
  }

  async findManageOrderByKeyWord(keyword: number) {
    return await this.entityManager
      .createQueryBuilder(Orders, 'o')
      .where('o.ordercode =:keyword', { keyword })
      .getMany();
  }

  async findOrderNew() {
    return await this.entityManager
      .createQueryBuilder(Orders, 'o')
      .innerJoinAndSelect('o.user', 'u')
      .orderBy('o.orderdate', 'DESC')
      .getMany();
  }

  async getTopUsers(): Promise<any> {
    return await this.entityManager
      .createQueryBuilder(Orders, 'o')
      .select('u.*', 'userid')
      .addSelect('SUM(o.totalprice)', 'total')
      .innerJoin('users', 'u', 'o.userid = u.userid')
      .groupBy('u.userid')
      .addGroupBy('u.username')
      .orderBy('total', 'DESC')
      .limit(3)
      .getRawMany();
  }

  async getRevenueToday(filter: string): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    let startDate: Date;
    let endDate: Date;
  
    switch (filter) {
      case 'Today':
        startDate = today;
        endDate = today;
        break;
      case '3 days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 2);
        endDate = today;
        break;
      case '7 days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);
        endDate = today;
        break;
      case '14 days':
      case '21 days':
        const days = filter === '14 days' ? 14 : 21;
        startDate = new Date(today);
        startDate.setDate(today.getDate() - (days - 1));
        endDate = today;
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = today;
        break;
      case '1 year': {
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = today;
  
        const revenues = await this.entityManager
          .createQueryBuilder(Orders, 'o')
          .select([
            "EXTRACT(MONTH FROM o.orderdate) as month",
            "SUM(o.totalprice) as revenue",
          ])
          .where("o.orderdate >= :startDate AND o.orderdate <= :endDate", {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
          })
          .groupBy("EXTRACT(MONTH FROM o.orderdate)")
          .orderBy("month", "ASC")
          .getRawMany();
  
        const months = Array.from({ length: 12 }, (_, i) =>
          new Date(0, i).toLocaleString('default', { month: 'long' })
        );
        const revenuesData = Array(12).fill(0);
  
        revenues.forEach(r => {
          revenuesData[r.month - 1] = r.revenue || 0;
        });
  
        return { months, revenues: revenuesData };
      }
      case '2 years':
      case '3 years': {
        const yearCount = filter === '2 years' ? 2 : 3;
        startDate = new Date(today.getFullYear() - yearCount + 1, 0, 1);
        endDate = today;
  
        const revenues = await this.entityManager
          .createQueryBuilder(Orders, 'o')
          .select([
            "EXTRACT(YEAR FROM o.orderdate) as year",
            "SUM(o.totalprice) as revenue",
          ])
          .where("o.orderdate >= :startDate AND o.orderdate <= :endDate", {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
          })
          .groupBy("EXTRACT(YEAR FROM o.orderdate)")
          .orderBy("year", "DESC")
          .getRawMany();
  
        return {
          years: revenues.map(r => r.year),
          revenues: revenues.map(r => r.revenue || 0),
        };
      }
      case 'All': {
        const revenues = await this.entityManager
          .createQueryBuilder(Orders, 'o')
          .select([
            "EXTRACT(YEAR FROM o.orderdate) as year",
            "SUM(o.totalprice) as revenue", 
          ])
          .groupBy("EXTRACT(YEAR FROM o.orderdate)")
          .orderBy("year", "ASC") 
          .getRawMany();

        return {
          years: revenues.map(r => r.year),
          revenues: revenues.map(r => r.revenue || 0),
        };
      }
      default:
        throw new Error('Invalid filter');
    }
  
    const revenue = await this.entityManager
      .createQueryBuilder(Orders, 'o')
      .select('SUM(o.totalprice)', 'revenue')
      .where('o.orderdate >= :startDate AND o.orderdate <= :endDate', {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      })
      .getRawOne();
  
    return revenue?.revenue || 0;
  }

  async updateSeen(orderid: number){
    return await this.entityManager.transaction(async (manager) => {
      const order = await manager.findOne(Orders, { where: { orderid: orderid } });

      if(order){
        await manager.update(Orders, order.orderid,{
          isseen: 'True'
        });
        return { success: true, message: 'Updated Isseen Order successfully' };
      }else{
        return { success: true, message: 'Updated Isseen Order successfully' };
      }
    })
  }
}
