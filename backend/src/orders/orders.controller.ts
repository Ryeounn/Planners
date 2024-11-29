import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }

  @Post('createOrder')
  async createOrder(
    @Body('adults') adults: any[],
    @Body('children') children: any[],
    @Body('babies') babies: any[],
    @Body('tour') tour: number,
    @Body('userid') userid: number,
    @Body('totalquantity') totalQuantity: number,
    @Body('totalPrice') totalPrice: number
  ) {
    try {
      const order = await this.ordersService.createOrder(adults, children, babies, tour, userid, totalQuantity, totalPrice);
      return {
        success: true,
        message: 'Order created successfully',
        data: order
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create order',
        error: error.message,
      };
    }
  }

  @Post('/getAllOrder')
  async getAllOrder(@Body('userid') userid: number){
    return await this.ordersService.findAllOrder(userid);
  }

  @Post('/findAllOrderCount')
  async findAllOrderCount(){
    return await this.ordersService.findAllOrderCount();
  }

  @Post('/sumRevenue')
  async sumRevenue(){
    return await this.ordersService.sumRevenue();
  }

  @Post('/findAllOrderAndUser')
  async findAllOrderAndUser(){
    return await this.ordersService.findAllOrderAndUser();
  }

  @Post('/findOrderByOrderCode')
  async findOrderByOrderCode(@Body('ordercode') ordercode: string){
    return await this.ordersService.findOrderByOrderCode(ordercode);
  }

  @Post('/findManageOrderByKeyWord')
  async findManageOrderByKeyWord(@Body('keyword') keyword: number){
    return await this.ordersService.findManageOrderByKeyWord(keyword);
  }

  @Post('/findManageOrder')
  async findManageOrder(@Body('status') status: string){
    if(status === "All"){
      return await this.ordersService.findManageAllOrder();
    }else{
      return await this.ordersService.findManagePendingOrder(status);
    }
  }

  @Post('/findManageOneOrder')
  async findManageOneOrder(@Body('orderid') orderid: number){
    return await this.ordersService.findManageOneOrder(orderid);
  }

  @Post('/updateStatus')
  async updateStatus(@Body('orderid') orderid: number,@Body('condition') condition: string){
    return await this.ordersService.updateStatus(orderid, condition);
  }

  @Post('/findOrderNew')
  async findOrderNew(){
    return await this.ordersService.findOrderNew();
  }

  @Post('/getTopUsers')
  async getTopUsers(){
    return await this.ordersService.getTopUsers();
  }

  @Post('/getRevenueToday')
  async getRevenueToday(@Body('filter') filter: string){
    return await this.ordersService.getRevenueToday(filter);
  }

  @Post('/updateSeen')
  async updateSeen(@Body('orderid') orderid: number){
    return await this.ordersService.updateSeen(orderid);
  }
}
