import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TourpriceService } from './tourprice.service';
import { CreateTourpriceDto } from './dto/create-tourprice.dto';
import { UpdateTourpriceDto } from './dto/update-tourprice.dto';

@Controller('tourprice')
export class TourpriceController {
  constructor(private readonly tourpriceService: TourpriceService) {}

  @Get()
  findAll() {
    return this.tourpriceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tourpriceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTourpriceDto: UpdateTourpriceDto) {
    return this.tourpriceService.update(+id, updateTourpriceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tourpriceService.remove(+id);
  }

  @Post('/findTourByNationAndDate')
  async findTourByNationAndDate(@Body() body: any ){
    const { nation, startDate } = body;
    return await this.tourpriceService.findByNationAndDate(nation,startDate);
  }

  @Post('/getTourPrice')
  async findByTourPrice(@Body('id') id: number){
    return await this.tourpriceService.findByTourId(id);
  }

  @Post('/findPriceByTourId')
  async findPriceByTourId(@Body('tourid') tourid: number){
    return await this.tourpriceService.findPriceByTourId(tourid);
  }
}
