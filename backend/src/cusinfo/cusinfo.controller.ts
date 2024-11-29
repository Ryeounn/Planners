import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CusinfoService } from './cusinfo.service';
import { CreateCusinfoDto } from './dto/create-cusinfo.dto';
import { UpdateCusinfoDto } from './dto/update-cusinfo.dto';

@Controller('cusinfo')
export class CusinfoController {
  constructor(private readonly cusinfoService: CusinfoService) {}

  @Post()
  create(@Body() createCusinfoDto: CreateCusinfoDto) {
    return this.cusinfoService.create(createCusinfoDto);
  }

  @Get()
  findAll() {
    return this.cusinfoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cusinfoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCusinfoDto: UpdateCusinfoDto) {
    return this.cusinfoService.update(+id, updateCusinfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cusinfoService.remove(+id);
  }
}
