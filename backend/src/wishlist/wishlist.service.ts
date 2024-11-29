import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { GroupWishlist } from 'src/groupwishlist/entities/groupwishlist.entity';
import { Tour } from 'src/tour/entities/tour.entity';

@Injectable()
export class WishlistService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  create(createWishlistDto: CreateWishlistDto) {
    return 'This action adds a new wishlist';
  }

  findAll() {
    return `This action returns all wishlist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wishlist`;
  }

  update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return `This action updates a #${id} wishlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} wishlist`;
  }

  async findWishListLastest(groupwishlistid: number) {
    return await this.entityManager
      .createQueryBuilder(Wishlist, 'w')
      .innerJoinAndSelect('w.tour', 'tour')
      .where('w.groupwishlistid = :groupwishlistid', { groupwishlistid })
      .orderBy('w.dayadd', 'DESC')
      .getOne();
  }

  async countWishListByGroup(groupwishlistid: number) {
    return this.entityManager
      .createQueryBuilder(Wishlist, 'wishlist')
      .where('wishlist.groupwishlist =:groupwishlistid', { groupwishlistid })
      .getCount();
  }

  async findAllWishlistByGroupId(groupwishlistid: number) {
    return await this.entityManager
      .createQueryBuilder(Wishlist, 'w')
      .innerJoinAndSelect('w.tour', 'tour')
      .where('w.groupwishlistid = :groupwishlistid', { groupwishlistid })
      .orderBy('w.dayadd', 'DESC')
      .getMany();
  }

  async createWishlist(groupwishlistid: number, tourid: number) {
    let group = await this.entityManager.findOne(GroupWishlist, { where: { groupwishlistid: groupwishlistid } });
    let tour = await this.entityManager.findOne(Tour, { where: { tourid: tourid } });

    let condition = await this.entityManager.findOne(Wishlist, {
      where: {
        tour: tour,
        groupwishlist: group
      }
    });

    if (condition) {
      return { fail: false, message: 'Wishlist already exist' };
    } else {
      condition = this.entityManager.create(Wishlist, {
        tour: tour,
        groupwishlist: group,
        dayadd: new Date(),
      });
      await this.entityManager.save(condition);
      return { success: true, message: 'Wishlist created successfully' };
    }
  }

  async deleteWishlist(wishlistId: number) {
    let wl = await this.entityManager.findOne(Wishlist, { where: { wishlistid: wishlistId } });

    if (wl) {
      await this.entityManager.delete(Wishlist, wl.wishlistid);
      return { success: true, message: 'Wishlist deleted successfully' };
    } else {
      return { fail: false, message: 'Wishlist not found' };
    }
  }

  async getAllWishlistUser(userid: number) {
    return await this.entityManager
      .createQueryBuilder(Wishlist, 'wl')
      .innerJoinAndSelect('wl.groupwishlist', 'gr')
      .innerJoinAndSelect('wl.tour', 't')
      .where('gr.userid = :userid', { userid })
      .getMany();
  }

  async deleteWishlistDestination(userid: number, tourid: number) {
    const subQuery = this.entityManager
      .createQueryBuilder(GroupWishlist, 'gw')
      .select('gw.groupwishlistid')
      .where('gw.userid = :userid', { userid });

    await this.entityManager
      .createQueryBuilder()
      .delete()
      .from(Wishlist)
      .where('tourid = :tourid', { tourid })
      .andWhere(`groupwishlistid IN (${subQuery.getQuery()})`)
      .setParameters({ userid })
      .execute();
    return { success: true, message: 'The tour has been removed from the favorites list successfully' };
  }

  async deleteGroupInWishList(groupwishlistid: number, userid: number) {
    const groupwishlist = await this.entityManager.findOne(GroupWishlist, {
      where: { groupwishlistid, user: { userid } },
    });

    if (!groupwishlist) {
      return { success: false, message: 'Group wishlist not found or does not belong to the user' };
    }

    const wishlists = await this.entityManager.find(Wishlist, {
      where: { groupwishlist: { groupwishlistid } },
    });

    if (wishlists.length > 0) {
      await this.entityManager.delete(Wishlist, { groupwishlist: { groupwishlistid } });
    }
    await this.entityManager.delete(GroupWishlist, { groupwishlistid });

    return { success: true, message: 'Group wishlist and associated wishlists have been deleted successfully' };
  }
}
