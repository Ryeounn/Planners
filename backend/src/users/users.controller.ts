import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcryptjs';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('/getUserCheckOut')
  async findUserCheckOut(@Body('id') id: number) {
    return await this.usersService.findByUserId(id);
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    const hashedPassword = await hash(password, saltRounds);
    return hashedPassword;
  }

  @Post('/register')
  async register(@Body() registerData: any) {
    const { email, password, name } = registerData;
    const newpass = await this.hashPassword(password);
    return await this.usersService.createUser(name, email, newpass);
  }

  @Post('/updateProfile')
  async updateProfile(@Body() changeData: any) {
    const { userId, name, email, phone, gender, birthday, city, nation, address } = changeData;
    return await this.usersService.updateProfile(name, email, phone, gender, birthday, city, nation, address, userId);
  }

  @Post('/updatePassword')
  async updatePassword(@Body() changeData: any) {
    const { userId, password } = changeData;
    const newpass = await this.hashPassword(password);
    return await this.usersService.changePassword(userId, newpass);
  }

  @Post('/updateAvatar')
  async updateAvatar(@Body() changeData: any) {
    const { userId, avatar } = changeData;
    return await this.usersService.changeAvatar(userId, avatar);
  }

  @Post('/findAllUserCount')
  async findAllUserCount() {
    return await this.usersService.findAllUserCount();
  }

  @Post('/findAllUser')
  async findAllUser() {
    return await this.usersService.findAllUser();
  }

  @Post('create')
  async create(@Body() createData: any) {
    const { username, email, birthday, gender, phone, pass, nation, city, addr, userpath, created } = createData;
    const hashpass = await this.hashPassword(pass);
    return await this.usersService.create(username, email, birthday, gender, phone, hashpass, nation, city, addr, userpath, created);
  }

  @Post('/findByUserId')
  async findByUserId(@Body('id') id: number) {
    return await this.usersService.findByUserId(id);
  }

  @Post('/update')
  async update(@Body() editData: any) {
    const { username, email, birthday, gender, phone, nation, city, addr, userpath, userid } = editData;
    return await this.usersService.edit(username, email, birthday, gender, phone, nation, city, addr, userpath, userid);
  }

  @Post('/delete')
  async delete(@Body('userid') userid: any) {
    return await this.usersService.delete(userid);
  }

  @Post('/findByEmail')
  async findByEmail(@Body('keyword') keyword: string) {
    return await this.usersService.findByEmail(keyword);
  }

  @Post('/forgotPassword')
  async forgotPassword(@Body('newpassword') newpassword: string, @Body('confirmpass') confirmpass: string, @Body('email') email: string) {
    return await this.usersService.forgotPassword(newpassword, confirmpass, email);
  }

  @Post('/getRegistrationCountPerMonth')
  async getRegistrationCountPerMonth(){
    return await this.usersService.getRegistrationCountPerMonth();
  }
}
