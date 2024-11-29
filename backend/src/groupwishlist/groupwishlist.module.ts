import { Module } from '@nestjs/common';
import { GroupwishlistService } from './groupwishlist.service';
import { GroupwishlistController } from './groupwishlist.controller';

@Module({
  controllers: [GroupwishlistController],
  providers: [GroupwishlistService],
})
export class GroupwishlistModule {}
