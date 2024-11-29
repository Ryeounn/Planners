import { Module } from '@nestjs/common';
import { CusinfoService } from './cusinfo.service';
import { CusinfoController } from './cusinfo.controller';

@Module({
  controllers: [CusinfoController],
  providers: [CusinfoService],
})
export class CusinfoModule {}
