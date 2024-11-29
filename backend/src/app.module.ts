import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from 'db/datasource';
import { UsersModule } from './users/users.module';
import { AdminsModule } from './admins/admins.module';
import { RegionModule } from './region/region.module';
import { CityModule } from './city/city.module';
import { AgeModule } from './age/age.module';
import { TourModule } from './tour/tour.module';
import { ScheduleModule } from './schedule/schedule.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { GroupwishlistModule } from './groupwishlist/groupwishlist.module';
import { TourpriceModule } from './tourprice/tourprice.module';
import { OrdersModule } from './orders/orders.module';
import { OrderdetailModule } from './orderdetail/orderdetail.module';
import { BlogModule } from './blog/blog.module';
import { BlogimagesModule } from './blogimages/blogimages.module';
import { ParagraphsModule } from './paragraphs/paragraphs.module';
import { AuthModule } from './auth/auth.module';
import { AttractionModule } from './attraction/attraction.module';
import { HistoryModule } from './history/history.module';
import { CusinfoModule } from './cusinfo/cusinfo.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions), UsersModule, AdminsModule, RegionModule, CityModule, AgeModule, TourModule, ScheduleModule, WishlistModule, GroupwishlistModule, TourpriceModule, OrdersModule, OrderdetailModule, BlogModule, BlogimagesModule, ParagraphsModule, AuthModule, AttractionModule, HistoryModule, CusinfoModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
