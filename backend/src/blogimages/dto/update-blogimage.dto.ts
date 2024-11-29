import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogimageDto } from './create-blogimage.dto';

export class UpdateBlogimageDto extends PartialType(CreateBlogimageDto) {}
