import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TourService } from './tour.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { ScheduleService } from 'src/schedule/schedule.service';

@Controller('tour')
export class TourController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly tourService: TourService
  ) {}

  @Get()
  findAll() {
    return this.tourService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tourService.findOne(+id);
  }
  
  @Post('/getDestination')
  findByRegion(@Body('id') id: number){
    if(id === 0){
      return this.tourService.findAll();
    }else{
      return this.tourService.findByRegionId(id);
    }
  }

  @Post('/getTourById')
  async findByTourId(@Body('tour') tour: string){
    const tourid = parseInt(tour.split('-').pop(), 10);
    return await this.tourService.findByTourId(tourid);
  }

  @Post('/getTourId')
  async findTourId(@Body('tour') tour: number){
    return await this.tourService.findByTourId(tour);
  }

  @Post('/findAllTourCount')
  async findAllTourCount(){
    return await this.tourService.findAllTourCount();
  }

  @Post('/findAllTour')
  async findAllOrderByTourId(){
    return await this.tourService.findAllOrderByTourId();
  }

  @Post('/create')
  async create(@Body() createData: any){
    const {tourname,descrip,description,totaldate,startdate,airline,imgairline,tourpath,region,admin,nation,tourcode,priceadult,pricechildren,pricebaby} = createData;
    return await this.tourService.create(tourname,descrip,totaldate,startdate,airline,imgairline,tourpath,region,admin,nation,description,tourcode,priceadult,pricechildren,pricebaby);
  }

  @Post('/findTourByTourId')
  async findTourByTourId(@Body('tourid') tourid: number){
    return await this.tourService.findByTourId(tourid);
  }

  @Post('/findByTourIdAndRegion')
  async findByTourIdAndRegion(@Body('tourid') tourid: number){
    return await this.tourService.findByTourIdAndRegion(tourid);
  }

  @Post('/update')
  async update(@Body() editData: any){
    const {tourname,descrip,description,totaldate,startdate,airline,imgairline,tourpath,region,admin,nation,tourcode,priceadult,pricechildren,pricebaby,tourid} = editData;
    return await this.tourService.edit(tourname,descrip,totaldate,startdate,airline,imgairline,tourpath,region,admin,nation,description,tourcode,priceadult,pricechildren,pricebaby,tourid);
  }

  @Post('/delete')
  async delete(@Body('tourid') tourid: number){
    await this.scheduleService.delete(tourid);
    await this.tourService.delete(tourid);
  }

  @Post('/findByTourCode')
  async findByTourCode(@Body('keyword') keyword: string){
    return await this.tourService.findByTourCode(keyword);
  }
}
