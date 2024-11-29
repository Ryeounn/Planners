import { Injectable } from '@nestjs/common';
import { CreateTourpriceDto } from './dto/create-tourprice.dto';
import { UpdateTourpriceDto } from './dto/update-tourprice.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { TourPrice } from './entities/tourprice.entity';
import { Tour } from 'src/tour/entities/tour.entity';
import { Age } from 'src/age/entities/age.entity';

@Injectable()
export class TourpriceService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  findAll() {
    return `This action returns all tourprice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tourprice`;
  }

  update(id: number, updateTourpriceDto: UpdateTourpriceDto) {
    return `This action updates a #${id} tourprice`;
  }

  remove(id: number) {
    return `This action removes a #${id} tourprice`;
  }

  async findByNationAndDate(nation: string, startdate: Date){
    return await this.entityManager
    .createQueryBuilder(TourPrice, 'tourprice')
    .innerJoinAndSelect('tourprice.tour','tourid')
    .where('tourid.nation = :nation', {nation})
    .andWhere('tourid.startdate >= :startdate', {startdate})
    .groupBy('tourid.tourid')
    .addGroupBy('tourid.tourname')
    .addGroupBy('tourid.descrip')
    .addGroupBy('tourid.totaldate')
    .addGroupBy('tourid.startdate')
    .select([
      'tourid.*',
      'MIN(tourprice.price) AS minPrice'
    ])
    .getRawMany();
  }

  async findByTourId(id: number){
    return await this.entityManager
    .createQueryBuilder(TourPrice, 'tourprice')
    .where('tourprice.tourid = :id', {id})
    .getMany();
  }

  async findPriceByTourId(tourid: number){
    return await this.entityManager
    .createQueryBuilder(TourPrice, 'tp')
    .innerJoinAndSelect('tp.age', 'a')
    .where('tp.tourid = :tourid', {tourid})
    .orderBy('tp.price', 'DESC')
    .getMany();
  }

}
