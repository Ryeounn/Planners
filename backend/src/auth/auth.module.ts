import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { EntityManager } from 'typeorm';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Admin } from 'src/admins/entities/admin.entity';
import { UsersService } from 'src/users/users.service';
import { AdminsService } from 'src/admins/admins.service';
import { AdminsModule } from 'src/admins/admins.module';

@Module({
  imports: [
    AdminsModule,
    TypeOrmModule.forFeature([User, Admin]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    
  ],
  providers: [AuthService, JwtStrategy, UsersService, AdminsService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
