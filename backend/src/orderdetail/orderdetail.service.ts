import { Injectable } from '@nestjs/common';
import { CreateOrderdetailDto } from './dto/create-orderdetail.dto';
import { UpdateOrderdetailDto } from './dto/update-orderdetail.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';
import { OrderDetail } from './entities/orderdetail.entity';

@Injectable()
export class OrderdetailService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  create(createOrderdetailDto: CreateOrderdetailDto) {
    return 'This action adds a new orderdetail';
  }

  findAll() {
    return `This action returns all orderdetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderdetail`;
  }

  update(id: number, updateOrderdetailDto: UpdateOrderdetailDto) {
    return `This action updates a #${id} orderdetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderdetail`;
  }

  async getOrderDetailsWithTickets(orderid: number[] = []) {
    const queryBuilder = this.entityManager.createQueryBuilder('orderdetail', 'od')
      .innerJoinAndSelect('od.order', 'o')
      .innerJoinAndSelect('od.tourPrice', 'tp')
      .innerJoinAndSelect('tp.tour', 't')
      .select([
        'o.orderid',
        'o.ordercode',
        'o.orderdate',
        'o.totalquantity',
        'o.totalprice',
        'o.condition',
        't.*',
        'tp.ageid',
      ])
      .addSelect('COUNT(od.orderdetailid)', 'ticket_quantity')
      .groupBy('o.orderid')
      .addGroupBy('o.ordercode')
      .addGroupBy('o.orderdate')
      .addGroupBy('o.totalquantity')
      .addGroupBy('o.totalprice')
      .addGroupBy('o.condition')
      .addGroupBy('t.tourid')
      .addGroupBy('t.tourcode')
      .addGroupBy('t.tourname')
      .addGroupBy('t.descrip')
      .addGroupBy('t.totaldate')
      .addGroupBy('t.startdate')
      .addGroupBy('t.airline')
      .addGroupBy('tp.ageid')
      .orderBy('o.orderdate', 'DESC')
      .addOrderBy('tp.ageid', 'ASC');

    if (orderid.length > 0) {
      queryBuilder.andWhere('o.orderid IN (:...orderid)', { orderid });
    } else {
      queryBuilder.andWhere('o.orderid =: orderid', { orderid });
    }

    return await queryBuilder.getRawMany();
  }


  async findQuantityTicket(orderid: number[]) {
    return await this.entityManager
      .createQueryBuilder(OrderDetail, 'od')
      .select('a.agegroup', 'agegroup')
      .addSelect('o.orderid', 'orderid')
      .addSelect('COUNT(od.orderdetailid)', 'quantity')
      .addSelect('tp.price', 'price')
      .innerJoin('od.order', 'o')
      .innerJoin('od.tourPrice', 'tp')
      .innerJoin('tp.age', 'a')
      .where('o.orderid IN (:...orderid)', { orderid })
      .groupBy('o.orderid')
      .addGroupBy('a.agegroup')
      .addGroupBy('tp.price')
      .getRawMany();
  }

  async sumProductSold() {
    return await this.entityManager
      .createQueryBuilder(OrderDetail, 'orderDetail')
      .getCount();
  }

  async findQuantityEachTicket() {
    const result = await this.entityManager
      .createQueryBuilder()
      .from(OrderDetail, 'orderDetail')
      .leftJoin('orderDetail.tourPrice', 'tourPrice')
      .leftJoin('tourPrice.tour', 'tour')
      .select('tour.tourname', 'tourName')
      .addSelect('tour.tourid', 'tourId')
      .addSelect('COUNT(orderDetail.orderdetailid)', 'totalSold')
      .groupBy('tour.tourid')
      .orderBy('COUNT(orderDetail.orderdetailid)', 'ASC')
      .getRawMany();

    return result;
  }

  async findTopThreeTour() {
    return await this.entityManager
      .createQueryBuilder(OrderDetail, 'od')
      .leftJoin('od.tourPrice', 'tp')
      .leftJoin('tp.tour', 't')
      .select('t.*', 'tour')
      .addSelect('COUNT(od.orderdetailid)', 'totalSold')
      .groupBy('t.tourid')
      .orderBy('COUNT(od.orderdetailid)', 'DESC')
      .limit(3)
      .getRawMany();
  }

  async findOrderDetails(orderIds: number[]): Promise<OrderDetail[]> {
    return await this.entityManager
      .createQueryBuilder(OrderDetail, 'od')
      .leftJoinAndSelect('od.order', 'o')
      .leftJoinAndSelect('od.tourPrice', 'tp')
      .leftJoinAndSelect('tp.tour', 't')
      .where('o.orderid IN (:...orderIds)', { orderIds })
      .getMany();
  }

  async getOneOrderDetailsWithTickets(orderid: number) {
    return await this.entityManager
      .createQueryBuilder('orderdetail', 'od')
      .innerJoinAndSelect('od.order', 'o')
      .innerJoinAndSelect('od.tourPrice', 'tp')
      .innerJoinAndSelect('tp.tour', 't')
      .select([
        'o.orderid',
        'o.ordercode',
        'o.orderdate',
        'o.totalquantity',
        'o.totalprice',
        'o.condition',
        't.*',
        'tp.ageid',
      ])
      .addSelect('COUNT(od.orderdetailid)', 'ticket_quantity')
      .where('o.orderid =:orderid', { orderid })
      .groupBy('o.orderid')
      .addGroupBy('o.ordercode')
      .addGroupBy('o.orderdate')
      .addGroupBy('o.totalquantity')
      .addGroupBy('o.totalprice')
      .addGroupBy('o.condition')
      .addGroupBy('t.tourid')
      .addGroupBy('t.tourcode')
      .addGroupBy('t.tourname')
      .addGroupBy('t.descrip')
      .addGroupBy('t.totaldate')
      .addGroupBy('t.startdate')
      .addGroupBy('t.airline')
      .addGroupBy('tp.ageid')
      .orderBy('o.orderdate', 'DESC')
      .addOrderBy('tp.ageid', 'ASC')
      .getRawMany();
  }

  async findOneQuantityTicket(orderid: number) {
    return await this.entityManager
      .createQueryBuilder(OrderDetail, 'od')
      .select('a.agegroup', 'agegroup')
      .addSelect('o.orderid', 'orderid')
      .addSelect('COUNT(od.orderdetailid)', 'quantity')
      .addSelect('tp.price', 'price')
      .innerJoin('od.order', 'o')
      .innerJoin('od.tourPrice', 'tp')
      .innerJoin('tp.age', 'a')
      .where('o.orderid =:orderid', { orderid })
      .groupBy('o.orderid')
      .addGroupBy('a.agegroup')
      .addGroupBy('tp.price')
      .getRawMany();
  }

  async getTop10Tour() {
    return await this.entityManager
    .createQueryBuilder(OrderDetail, 'od')
    .leftJoin('od.tourPrice', 'tp')
    .leftJoin('tp.tour', 't')
    .select('t.tourid', 'tourid')
    .addSelect('t.tourname', 'tourname')
    .addSelect('SUM(tp.price)', 'total_orders')
    .groupBy('t.tourid')
    .addGroupBy('t.tourname')
    .orderBy('total_orders', 'DESC') 
    .limit(10)
    .getRawMany();
  }
}
