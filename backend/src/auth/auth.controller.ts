import { Controller, Post, Body, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersSerivce: UsersService,
    private mailService: MailService,
    private jwtService: JwtService
  ) {}

  @Post('google')
  async googleLogin(@Body() body: any) {
    const { tokenId } = body;

    const googleProfile = await this.usersSerivce.verifyGoogleToken(tokenId);

    const user = await this.authService.validateGoogleUser(googleProfile);

    const jwt = await this.authService.generateJwt(user);

    return { token: jwt, user };
  }

  @Post('login')
  async login(@Body() loginData: any) {
    const { email, password } = loginData;
    console.log('Email: ' + email);
    console.log('Password: ' + password);
    try {
      const result = await this.authService.findLogin(email, password);
      console.log(result);
      const decodedToken = this.jwtService.decode(result.token) as any;
      return {
        status: 'success',
        token: result.token,
        user: result,
        role: decodedToken.role,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new HttpException({
        status: 'error',
        message: error.message || 'Login failed',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  @Post('/user/sendMail')
  async sendMail(@Body('email') email: string){
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const namemail = "Planners Forgot Password Email.";
    await this.mailService.sendUserConfirmation(email, token, namemail);
    return { message: "Mã xác nhận đã gửi!", token };
  }
}
