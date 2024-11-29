import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParagraphsService } from './paragraphs.service';
import { CreateParagraphDto } from './dto/create-paragraph.dto';
import { UpdateParagraphDto } from './dto/update-paragraph.dto';

@Controller('paragraphs')
export class ParagraphsController {
  constructor(private readonly paragraphsService: ParagraphsService) { }

  @Post('/getBlogDetail')
  async findBlogDetailById(@Body() body: { name: string }) {
    const name = body.name; // Lấy giá trị name từ body
    console.log(name);
    return this.paragraphsService.findBlogByName(name);
  }

  @Post('/getAllParagraphsById')
  async findAllParagraphsById(@Body() body: {id: number}){
    const id = body.id;
    return this.paragraphsService.findAllParagraphById(id);
  }

  @Post()
  create(@Body() createParagraphDto: CreateParagraphDto) {
    return this.paragraphsService.create(createParagraphDto);
  }

  @Get()
  findAll() {
    return this.paragraphsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paragraphsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParagraphDto: UpdateParagraphDto) {
    return this.paragraphsService.update(+id, updateParagraphDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paragraphsService.remove(+id);
  }

  @Post('/findAllById')
  async findAllById(@Body('blogids') blogids: number[]){
    return this.paragraphsService.findAllById(blogids);
  }

  @Post('/findById')
  async findById(@Body('blogid') blogid: number){
    return this.paragraphsService.findById(blogid);
  }
}
