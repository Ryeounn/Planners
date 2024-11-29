import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupwishlistService } from './groupwishlist.service';
import { CreateGroupwishlistDto } from './dto/create-groupwishlist.dto';
import { UpdateGroupwishlistDto } from './dto/update-groupwishlist.dto';

@Controller('groupwishlist')
export class GroupwishlistController {
  constructor(private readonly groupwishlistService: GroupwishlistService) { }

  @Post()
  create(@Body() createGroupwishlistDto: CreateGroupwishlistDto) {
    return this.groupwishlistService.create(createGroupwishlistDto);
  }

  @Get()
  findAll() {
    return this.groupwishlistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupwishlistService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupwishlistDto: UpdateGroupwishlistDto) {
    return this.groupwishlistService.update(+id, updateGroupwishlistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupwishlistService.remove(+id);
  }

  @Post('/getAllByUserId')
  async getALlByUserId(@Body('userid') userid: number) {
    return this.groupwishlistService.findAllGroupWishListByUser(userid);
  }

  @Post('/createGroupwishlist')
  async createGroupwishlist(@Body() createData: any) {
    const { userId, name } = createData;
    return await this.groupwishlistService.createGroupwishlist(userId, name);
  }
}
