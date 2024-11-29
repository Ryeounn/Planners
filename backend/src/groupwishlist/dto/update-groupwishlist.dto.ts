import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupwishlistDto } from './create-groupwishlist.dto';

export class UpdateGroupwishlistDto extends PartialType(CreateGroupwishlistDto) {}
