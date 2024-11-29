import { Injectable } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Region } from './entities/region.entity';

@Injectable()
export class RegionService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  create(createRegionDto: CreateRegionDto) {
    return 'This action adds a new region';
  }

  findOne(id: number) {
    return `This action returns a #${id} region`;
  }

  update(id: number, updateRegionDto: UpdateRegionDto) {
    return `This action updates a #${id} region`;
  }

  remove(id: number) {
    return `This action removes a #${id} region`;
  }

  findAll() {
    return this.entityManager
      .createQueryBuilder(Region, 'region')
      .getMany();
  }
}
