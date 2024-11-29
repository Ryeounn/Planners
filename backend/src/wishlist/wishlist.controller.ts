import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistService.create(createWishlistDto);
  }

  @Get()
  findAll() {
    return this.wishlistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWishlistDto: UpdateWishlistDto) {
    return this.wishlistService.update(+id, updateWishlistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishlistService.remove(+id);
  }

  @Post('/findWishListLastest')
  async findWishListLastest(@Body('groupwishlistid') groupwishlistid: number){
    return await this.wishlistService.findWishListLastest(groupwishlistid);
  }

  @Post('/findAllWishlistByGroupId')
  async findAllWishlistByGroupId(@Body('groupwishlistid') groupwishlistid: number){
    return await this.wishlistService.findAllWishlistByGroupId(groupwishlistid);
  }

  @Post('/countAllWistlistByGroup')
  async countAllWistlistByGroup(@Body('groupwishlistid') groupwishlistid: number){
    return await this.wishlistService.countWishListByGroup(groupwishlistid);
  }

  @Post('/deleteWishlist')
  async deleteWishlist(@Body('wishlistid')  wishlistid: number){
    return await this.wishlistService.deleteWishlist(wishlistid);
  }

  @Post('/createWishlist')
  async createWishlist(@Body() createData: any){
    const {tourid, groupwishlistid} = createData;
    return await this.wishlistService.createWishlist(groupwishlistid,tourid);
  }

  @Post('/getAllWishlistUser')
  async getAllWishlistUser(@Body('userid') userid: number){
    return await this.wishlistService.getAllWishlistUser(userid);
  }

  @Post('/deleteTourWishList')
  async deleteWishlistDestination(@Body() deleteData: any){
    const { userid, tourid } = deleteData;
    return await this.wishlistService.deleteWishlistDestination(userid, tourid);
  }

  @Post('/deleteGroupWishList')
  async deleteGroupWishList(@Body() deleteData: any){
    const {userid, groupwishlistid} = deleteData;
    return await this.wishlistService.deleteGroupInWishList(groupwishlistid,userid);
  }
}
