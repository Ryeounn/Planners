import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { hash } from 'bcryptjs';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @Get()
  findAll() {
    return this.adminsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminsService.remove(+id);
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    const hashedPassword = await hash(password, saltRounds);
    return hashedPassword;
  }

  @Post('/findById')
  async findById(@Body('adminid') adminid: number){
    return await this.adminsService.findById(adminid);
  }

  @Post('/editName')
  async editName(@Body('adminid') adminid: number, @Body('adminname') adminname: string){
    return await this.adminsService.editName(adminid,adminname);
  }

  @Post('/editGender')
  async editGender(@Body('adminid') adminid: number, @Body('gender') gender: string){
    return await this.adminsService.editGender(adminid, gender);
  }

  @Post('/editBirthday')
  async editBirthday(@Body('adminid') adminid: number, @Body('birthday') birthday: string){
    const parsedBirthday = new Date(birthday);
    return await this.adminsService.editBirthday(adminid,parsedBirthday);
  }

  @Post('/editAvatar')
  async editAvatar(@Body('adminid') adminid: number, @Body('avatar') avatar: string){
    return await this.adminsService.editAvatar(adminid,avatar);
  }

  @Post('/editPassword')
  async editPassword(@Body('adminid') adminid: number, @Body('oldpassword') oldpassword: string, @Body('password') password: string){
    console.log(oldpassword);
    console.log(password);
    return await this.adminsService.editPassword(adminid,oldpassword,password);
  }
}
