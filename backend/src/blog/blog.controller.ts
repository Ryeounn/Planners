import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }

  @Post('/getLocation')
  async findLocations(){
    return this.blogService.findLocations();
  }

  @Post('/findAll')
  async findAll(@Body('status') status: string){
    if(status === "All"){
      return this.blogService.findAll();
    }else if(status === "Desc"){
      return this.blogService.findAllOrderDesc();
    }else{
      return this.blogService.findAll();
    }
  }

  @Post('create')
  async create(
    @Body()
    data: {
      name: string;
      location: string;
      images: string;
      content: string;
      adminid: number;
      paragraphs: {
        content: string;
        position: number;
        image: string;
      }[];
    },
  ) {
    try {
      await this.blogService.create(
        data.name,
        data.location,
        data.images,
        data.content,
        data.adminid,
        data.paragraphs,
      );
      return {
        status: 'success',
      };
    } catch (error) {
      return { message: "fail" };
    }
  }

  @Post('/findById')
  async findById(@Body('blogid') blogid: number){
    return this.blogService.findById(blogid);
  }

  @Post('/update')
  async update(
    @Body()
    data: {
      name: string;
      location: string;
      images: string;
      content: string;
      blogid: number;
      adminid: number;
      paragraphs: {
        paragraphid: number;
        content: string;
        position: number;
        image: string;
        blogimageid: number;
      }[];
    },
  ){
    try {
      console.log(data);
      await this.blogService.edit(
        data.name,
        data.location,
        data.images,
        data.content,
        data.blogid,
        data.paragraphs,
      );

      return { message: 'Blog updated successfully!' };
    } catch (error) {
      return { message: 'Failed to update blog', error: error.message };
    }
  }

  @Post('/delete')
  async delete(@Body('blogid') blogid: number){
    return await this.blogService.delete(blogid);
  }

  @Post('/findAllByCode')
  async findAllByCode(@Body('keyword') keyword: string){
    return await this.blogService.findAllByCode(keyword);
  }
}
