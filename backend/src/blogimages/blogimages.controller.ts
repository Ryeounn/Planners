import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlogimagesService } from './blogimages.service';
import { CreateBlogimageDto } from './dto/create-blogimage.dto';
import { UpdateBlogimageDto } from './dto/update-blogimage.dto';

@Controller('blogimages')
export class BlogimagesController {
  constructor(private readonly blogimagesService: BlogimagesService) {}

  @Post()
  create(@Body() createBlogimageDto: CreateBlogimageDto) {
    return this.blogimagesService.create(createBlogimageDto);
  }

  @Get()
  findAll() {
    return this.blogimagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogimagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogimageDto: UpdateBlogimageDto) {
    return this.blogimagesService.update(+id, updateBlogimageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogimagesService.remove(+id);
  }
}
