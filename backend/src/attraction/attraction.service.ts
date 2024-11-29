import { Injectable } from '@nestjs/common';
import { CreateAttractionDto } from './dto/create-attraction.dto';
import { UpdateAttractionDto } from './dto/update-attraction.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Attraction } from './entities/attraction.entity';

@Injectable()
export class AttractionService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  create(createAttractionDto: CreateAttractionDto) {
    return 'This action adds a new attraction';
  }

  findAll() {
    return `This action returns all attraction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attraction`;
  }

  update(id: number, updateAttractionDto: UpdateAttractionDto) {
    return `This action updates a #${id} attraction`;
  }

  remove(id: number) {
    return `This action removes a #${id} attraction`;
  }

  
  async findAllByRegionId(name: string) {
    return this.entityManager
      .createQueryBuilder(Attraction, 'attraction')
      .innerJoinAndSelect('attraction.city', 'cityid')
      .where('cityid.cityname = :name', { name })
      .getMany();
  }
}
