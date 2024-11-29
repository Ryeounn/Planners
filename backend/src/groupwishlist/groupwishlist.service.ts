import { Injectable } from '@nestjs/common';
import { CreateGroupwishlistDto } from './dto/create-groupwishlist.dto';
import { UpdateGroupwishlistDto } from './dto/update-groupwishlist.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { GroupWishlist } from './entities/groupwishlist.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class GroupwishlistService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  create(createGroupwishlistDto: CreateGroupwishlistDto) {
    return 'This action adds a new groupwishlist';
  }

  findAll() {
    return `This action returns all groupwishlist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} groupwishlist`;
  }

  update(id: number, updateGroupwishlistDto: UpdateGroupwishlistDto) {
    return `This action updates a #${id} groupwishlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} groupwishlist`;
  }
  
  async findAllGroupWishListByUser(userId: number){
    return await this.entityManager
    .createQueryBuilder(GroupWishlist, 'gr')
    .where('gr.userid = :userId', {userId})
    .orderBy('gr.createddate', 'DESC')
    .getMany();
  }
  
  async createGroupwishlist(userId: number, name: string){
    let user = await this.entityManager.findOne(User, { where: { userid: userId } });
    if(user){
      const group = this.entityManager.create(GroupWishlist, {
        user: user,
        groupname: name,
        createddate: new Date()
      });
      await this.entityManager.save(group);
      return { success: true, message: 'Group wishlist created successfully' };
    }else{
      return { success: true, message: 'Group wishlist created fail' };
    }

    
  }
}
