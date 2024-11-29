import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { error } from 'console';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class AdminsService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  findAll() {
    return `This action returns all admins`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }

  findLogin = async (email: string, password: string) => {
    return await this.entityManager
      .createQueryBuilder(Admin, 'admin')
      .where('admin.email = :email', { email })
      .andWhere('admin.pass = :pass', { password })
      .getOne();
  }

  async findById(adminid: number) {
    return await this.entityManager
      .createQueryBuilder(Admin, 'a')
      .where('a.adminid =:adminid', { adminid })
      .getOne();
  }

  async editName(adminid: number, adminname: string) {
    return await this.entityManager.transaction(async (manager) => {
      const admin = await manager.findOne(Admin, { where: { adminid: adminid } });
      if (admin) {
        admin.adminname = adminname;
        await manager.save(admin);
        return { success: true, message: 'Admin name updated successfully' };
      } else {
        return { success: false, message: 'Admin name updated fail' };
      }
    })
  }

  async editGender(adminid: number, gender: string) {
    return await this.entityManager.transaction(async (manager) => {
      const admin = await manager.findOne(Admin, { where: { adminid: adminid } });
      if (admin) {
        admin.gender = gender;
        await manager.save(admin);
        return { success: true, message: 'Admin gender updated successfully' };
      } else {
        return { success: false, message: 'Admin gender updated fail' };
      }
    })
  }

  async editBirthday(adminid: number, birthday: Date) {
    return await this.entityManager.transaction(async (manager) => {
      const admin = await manager.findOne(Admin, { where: { adminid: adminid } });
      if (admin) {
        admin.birthday = birthday;
        await manager.save(admin);
        return { success: true, message: 'Admin birthday updated successfully' };
      } else {
        return { success: false, message: 'Admin birthday updated fail' };
      }
    })
  }

  async editAvatar(adminid: number, avatar: string) {
    return await this.entityManager.transaction(async (manager) => {
      const admin = await manager.findOne(Admin, { where: { adminid: adminid } });
      if (admin) {
        admin.adminpath = avatar;
        await manager.save(admin);
        return { success: true, message: 'Admin avatar updated successfully' };
      } else {
        return { success: false, message: 'Admin avatar updated fail' };
      }
    })
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    const hashedPassword = await hash(password, saltRounds);
    return hashedPassword;
  }

  async editPassword(adminid: number, oldpassword: string, password: string) {
    return await this.entityManager.transaction(async (manager) => {
      const admin = await manager.findOne(Admin, {
        where: { adminid: adminid },
      });

      if (!admin) {
        return { success: false, message: 'Admin not found' };
      }

      const isMatch = await compare(oldpassword, admin.pass);
      if (!isMatch) {
        return { success: false, message: 'Old password does not match' };
      }

      try {
        const hashedNewPassword = await this.hashPassword(password);
        admin.pass = hashedNewPassword;
        console.log('New password saved:', admin.pass);
        await manager.save(admin);
        return { success: true, message: 'Admin password updated successfully' };
      } catch (error) {
        console.error('Error saving new password:', error);
        return { success: false, message: 'Failed to update password' };
      }
    });
  }
}
