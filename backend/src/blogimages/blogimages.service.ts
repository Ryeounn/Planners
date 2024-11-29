import { Injectable } from '@nestjs/common';
import { CreateBlogimageDto } from './dto/create-blogimage.dto';
import { UpdateBlogimageDto } from './dto/update-blogimage.dto';

@Injectable()
export class BlogimagesService {
  create(createBlogimageDto: CreateBlogimageDto) {
    return 'This action adds a new blogimage';
  }

  findAll() {
    return `This action returns all blogimages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blogimage`;
  }

  update(id: number, updateBlogimageDto: UpdateBlogimageDto) {
    return `This action updates a #${id} blogimage`;
  }

  remove(id: number) {
    return `This action removes a #${id} blogimage`;
  }
}
