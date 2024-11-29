import { Module } from '@nestjs/common';
import { TourService } from './tour.service';
import { TourController } from './tour.controller';
import { ScheduleModule } from 'src/schedule/schedule.module';

@Module({
  controllers: [TourController],
  providers: [TourService],
  imports: [ScheduleModule],
})
export class TourModule {}
