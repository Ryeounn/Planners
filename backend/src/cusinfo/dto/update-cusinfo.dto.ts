import { PartialType } from '@nestjs/mapped-types';
import { CreateCusinfoDto } from './create-cusinfo.dto';

export class UpdateCusinfoDto extends PartialType(CreateCusinfoDto) {}
