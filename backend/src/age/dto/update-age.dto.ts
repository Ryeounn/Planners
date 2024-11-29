import { PartialType } from '@nestjs/mapped-types';
import { CreateAgeDto } from './create-age.dto';

export class UpdateAgeDto extends PartialType(CreateAgeDto) {}
