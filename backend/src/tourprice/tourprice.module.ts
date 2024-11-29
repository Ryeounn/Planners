import { Module } from '@nestjs/common';
import { TourpriceService } from './tourprice.service';
import { TourpriceController } from './tourprice.controller';

@Module({
  controllers: [TourpriceController],
  providers: [TourpriceService],
})
export class TourpriceModule {}
