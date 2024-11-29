import { Injectable } from '@nestjs/common';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Tour } from './entities/tour.entity';
import { Region } from 'src/region/entities/region.entity';
import { Admin } from 'src/admins/entities/admin.entity';
import { TourPrice } from 'src/tourprice/entities/tourprice.entity';
import { Age } from 'src/age/entities/age.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';

@Injectable()
export class TourService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  findOne(id: number) {
    return `This action returns a #${id} tour`;
  }

  update(id: number, updateTourDto: UpdateTourDto) {
    return `This action updates a #${id} tour`;
  }

  async findAll() {
    return this.entityManager
      .createQueryBuilder(Tour, 'tour')
      .getMany();
  }

  async findAllOrderByTourId() {
    return this.entityManager
      .createQueryBuilder(Tour, 'tour')
      .where('tour.condition =:available',{available: 'Available'})
      .orderBy('tour.tourid', 'DESC')
      .getMany();
  }

  async findByRegionId(id: number) {
    return await this.entityManager
      .createQueryBuilder(Tour, 'tour')
      .innerJoinAndSelect('tour.region', 'regionid')
      .where('regionid.regionid = :id', { id })
      .getMany();
  }

  async findByTourId(id: number) {
    return await this.entityManager
      .createQueryBuilder(Tour, 'tour')
      .where('tour.tourid = :id', { id })
      .andWhere('tour.condition =:available',{available: 'Available'})
      .getOne();
  }

  async findAllTourCount() {
    return await this.entityManager
      .createQueryBuilder(Tour, 't')
      .where('t.condition =:available',{available: 'Available'})
      .getCount();
  }

  async create(tourname: string, descrip: string, totaldate: number, startdate: Date, airline: string, imgairline: string, tourpath: string, regionid: number, adminid: number, nation: string, desclong: string, tourcode: string, priceadult: number, pricechildren: number, pricebaby: number) {
    return await this.entityManager.transaction(async (manager) => {
      try {
        const region = await manager.findOne(Region, { where: { regionid: regionid } });
        const admin = await manager.findOne(Admin, { where: { adminid: adminid } });
        const age1 = await manager.findOne(Age, { where: { ageid: 1 } });
        const age2 = await manager.findOne(Age, { where: { ageid: 2 } });
        const age3 = await manager.findOne(Age, { where: { ageid: 3 } });

        const tour = manager.create(Tour, {
          tourname: tourname,
          descrip: descrip,
          totaldate: totaldate,
          startdate: startdate,
          airline: airline,
          imgairline: imgairline,
          inventory: 500,
          condition: 'Available',
          tourpath: tourpath,
          region: region,
          admin: admin,
          nation: nation,
          desclong: desclong,
          tourcode: tourcode
        })

        const saveTour = await manager.save(tour);

        const baby = manager.create(TourPrice, {
          price: pricebaby,
          tour: saveTour,
          age: age1
        })

        const children = manager.create(TourPrice, {
          price: pricechildren,
          tour: saveTour,
          age: age2
        })

        const adult = manager.create(TourPrice, {
          price: priceadult,
          tour: saveTour,
          age: age3
        })

        await manager.save(baby);
        await manager.save(children);
        await manager.save(adult);

        return { success: true, message: 'Tour created successfully' };
      }
      catch (error) {
        console.error('Error creating order:', error.message);
        throw new Error('Failed to create order');
      }
    })
  }

  async findByTourIdAndRegion(id: number) {
    return await this.entityManager
      .createQueryBuilder(Tour, 'tour')
      .innerJoinAndSelect('tour.region', 'r')
      .where('tour.tourid = :id', { id })
      .andWhere('tour.condition =:available',{available: 'Available'})
      .getOne();
  }

  async edit(tourname: string, descrip: string, totaldate: number, startdate: Date, airline: string, imgairline: string, tourpath: string, regionid: number, adminid: number, nation: string, desclong: string, tourcode: string, priceadult: number, pricechildren: number, pricebaby: number, tourid: number) {
    return await this.entityManager.transaction(async (manager) => {
      try {
        const region = await manager.findOne(Region, { where: { regionid: regionid } });
        const admin = await manager.findOne(Admin, { where: { adminid: adminid } });
        const age1 = await manager.findOne(Age, { where: { ageid: 1 } });
        const age2 = await manager.findOne(Age, { where: { ageid: 2 } });
        const age3 = await manager.findOne(Age, { where: { ageid: 3 } });

        const tour = await manager.findOne(Tour, { where: { tourid: tourid } });

        if (!tour) {
          throw new Error('Tour not found');
        }
        tour.tourname = tourname;
        tour.descrip = descrip;
        tour.totaldate = totaldate;
        tour.startdate = startdate;
        tour.airline = airline;
        tour.imgairline = imgairline;
        tour.tourpath = tourpath;
        tour.region = region;
        tour.admin = admin;
        tour.nation = nation;
        tour.desclong = desclong;
        tour.tourcode = tourcode;

        const price1 = await manager.findOne(TourPrice, { where: { age: age1, tour: tour } });
        const price2 = await manager.findOne(TourPrice, { where: { age: age2, tour: tour } });
        const price3 = await manager.findOne(TourPrice, { where: { age: age3, tour: tour } });

        if (price1) {
          if (price1.price !== pricebaby) {
            price1.price = pricebaby;
            await manager.save(price1);
          }
        }
        
        if (price2) {
          if (price2.price !== pricechildren) {
            price2.price = pricechildren;
            await manager.save(price2);
          }
        }
        
        if (price3) {
          if (price3.price !== priceadult) {
            price3.price = priceadult;
            await manager.save(price3);
          }
        }

        await manager.save(tour);

        return { success: true, message: 'Tour updated successfully' };
      } catch (error) {
        console.error('Error creating order:', error.message);
        throw new Error('Failed to create order');
      }
    })
  }

  async delete(tourid: number) {
    return await this.entityManager.transaction(async (manager) => {
      try {
        const tour = await manager.findOne(Tour, { where: { tourid: tourid } });
        const age1 = await manager.findOne(Age, { where: { ageid: 1 } });
        const age2 = await manager.findOne(Age, { where: { ageid: 2 } });
        const age3 = await manager.findOne(Age, { where: { ageid: 3 } });
        const price1 = await manager.findOne(TourPrice, { where: { age: age1, tour: tour } });
        const price2 = await manager.findOne(TourPrice, { where: { age: age2, tour: tour } });
        const price3 = await manager.findOne(TourPrice, { where: { age: age3, tour: tour } });

        if (price1) {
          await manager.remove(price1);
        }
        
        if (price2) {
          await manager.remove(price2);
        }
        
        if (price3) {
          await manager.remove(price3);
        }

        if(tour){
          await manager.remove(tour);
        }

        return { success: true, message: 'Deleted Tour successfully' };
      } catch (error) {
        console.error('Error creating order:', error.message);
        throw new Error('Failed to create order');
      }
    });
  }

  async findByTourCode(tourcode: string){
    return this.entityManager
      .createQueryBuilder(Tour, 'tour')
      .where('tour.tourcode LIKE :tourcode', {tourcode: '%' + tourcode + '%'})
      .andWhere('tour.condition =:available',{available: 'Available'})
      .orderBy('tour.tourid', 'DESC')
      .getMany();
  }
}
