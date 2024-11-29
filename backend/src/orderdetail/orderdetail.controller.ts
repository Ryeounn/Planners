import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderdetailService } from './orderdetail.service';
import { CreateOrderdetailDto } from './dto/create-orderdetail.dto';
import { UpdateOrderdetailDto } from './dto/update-orderdetail.dto';

@Controller('orderdetail')
export class OrderdetailController {
  constructor(private readonly orderdetailService: OrderdetailService) { }

  @Post()
  create(@Body() createOrderdetailDto: CreateOrderdetailDto) {
    return this.orderdetailService.create(createOrderdetailDto);
  }

  @Get()
  findAll() {
    return this.orderdetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderdetailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderdetailDto: UpdateOrderdetailDto) {
    return this.orderdetailService.update(+id, updateOrderdetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderdetailService.remove(+id);
  }

  @Post('/getAllOrderDetail')
  async getAllOrderDetail(@Body('orderid') orderid: number[]) {
    return await this.orderdetailService.getOrderDetailsWithTickets(orderid);
  }

  @Post('/getQuantityTicket')
  async getQuantityTicket(@Body('orderid') orderid: number[]) {
    return await this.orderdetailService.findQuantityTicket(orderid);
  }

  @Post('/sumProductSold')
  async sumProductSold() {
    return await this.orderdetailService.sumProductSold();
  }

  @Post('/findQuantityEachTicket')
  async findQuantityEachTicket() {
    return await this.orderdetailService.findQuantityEachTicket();
  }

  @Post('/findTopThreeTour')
  async findTopThreeTour() {
    return await this.orderdetailService.findTopThreeTour();
  }

  @Post('/findOrderDetails')
  async findOrderDetails(@Body('orderIds') orderIds: number[]) {
    if (!orderIds || orderIds.length === 0) {
      return { message: 'List orderId blank' };
    }
    return this.orderdetailService.findOrderDetails(orderIds);
  }

  @Post('/getOneOrderDetail')
  async getOneOrderDetailsWithTickets(@Body('orderid') orderid: number){
    return await this.orderdetailService.getOneOrderDetailsWithTickets(orderid);
  }

  @Post('/getOneQuantityTicket')
  async getOneQuantityTicket(@Body('orderid') orderid: number){
    return await this.orderdetailService.findOneQuantityTicket(orderid);
  }

  @Post('/getTop10Tour')
  async getTop10Tour(){
    return await this.orderdetailService.getTop10Tour();
  }
}
