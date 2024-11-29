import { Module } from '@nestjs/common';
import { BlogimagesService } from './blogimages.service';
import { BlogimagesController } from './blogimages.controller';

@Module({
  controllers: [BlogimagesController],
  providers: [BlogimagesService],
})
export class BlogimagesModule {}
