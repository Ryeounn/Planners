import { Injectable } from '@nestjs/common';
import { CreateCusinfoDto } from './dto/create-cusinfo.dto';
import { UpdateCusinfoDto } from './dto/update-cusinfo.dto';

@Injectable()
export class CusinfoService {
  create(createCusinfoDto: CreateCusinfoDto) {
    return 'This action adds a new cusinfo';
  }

  findAll() {
    return `This action returns all cusinfo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cusinfo`;
  }

  update(id: number, updateCusinfoDto: UpdateCusinfoDto) {
    return `This action updates a #${id} cusinfo`;
  }

  remove(id: number) {
    return `This action removes a #${id} cusinfo`;
  }
}
