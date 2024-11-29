import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(+id);
  }

  
  @Post('/home_viewpoint')
  findScheduleById(){
    return this.scheduleService.findScheduleById();
  }
  
  @Post('/getScheduleByTourId')
  async findByTourId(@Body('id') id: number){
    return await this.scheduleService.findByTourId(id);
  }

  @Post('/create')
  async create(@Body() scheduleData: any){
    const { tourid, schedules } = scheduleData;
    return await this.scheduleService.create(tourid, schedules);
  }


  @Post('/findByTourIds')
  async findByTourIds(@Body('tourid') tourid: number){
    return await this.scheduleService.findByTourIds(tourid);
  }

  @Post('/update')
  async update(@Body() scheduleData: any){
    const { tourid, schedules } = scheduleData;
    return await this.scheduleService.edit(tourid, schedules);
  }

  @Post('/delete')
  async delete(@Body('tourid') tourid: number){
    return await this.scheduleService.delete(tourid);
  }
}
