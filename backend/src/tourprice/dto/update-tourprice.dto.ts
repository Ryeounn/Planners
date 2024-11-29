import { PartialType } from '@nestjs/mapped-types';
import { CreateTourpriceDto } from './create-tourprice.dto';

export class UpdateTourpriceDto extends PartialType(CreateTourpriceDto) {}
