import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import axios from 'axios';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  findLogin = async (email: string, password: string) => {
    return await this.entityManager
      .createQueryBuilder(User, 'user')
      .where('user.email = :email', { email })
      .andWhere('user.pass = :pass', { password })
      .getOne();
  }

  async verifyGoogleToken(tokenId: string) {
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${tokenId}`,
    );
    return response.data;
  }

  async findByUserId(id: number) {
    return await this.entityManager
      .createQueryBuilder(User, 'users')
      .where('users.userid = :id', { id })
      .getOne();
  }


  async findOrCreateGoogleUser(profile: any) {
    const { email, sub: googleId, name, picture } = profile;

    let user = await this.entityManager.findOne(User, { where: { email } });
    console.log(user);

    if (!user) {

      user = this.entityManager.create(User, {
        email,
        username: name,
        pass: '',
        birthday: new Date(),
        userpath: picture,
        gender: '',
        created: new Date(),
        addr: '',
        phone: ''
      });


      await this.entityManager.save(user);
    } else {
      return user;
    }

    return user;
  }

  async createUser(namer: string, email: string, password: string) {
    let user = await this.entityManager.findOne(User, { where: { email } });

    if (!user) {
      user = this.entityManager.create(User, {
        email: email,
        username: namer,
        pass: password,
        birthday: '1990-01-01',
        userpath: '/assets/images/users/default.png',
        gender: '',
        created: new Date(),
        addr: '',
        phone: ''
      });

      await this.entityManager.save(user);
      return { success: true, user: user };
    } else {
      return { success: false, message: 'User already exists' };
    }
  }

  async updateProfile(name: string, email: string, phone: string, gender: string, birthday: Date, city: string, nation: string, address: string, userId: number) {
    let user = await this.entityManager.findOne(User, { where: { userid: userId } });

    if (user) {
      await this.entityManager.update(User, user.userid, {
        username: name,
        email: email,
        phone: phone,
        gender: gender,
        birthday: birthday,
        city: city,
        nation: nation,
        addr: address
      });
      return { success: true, message: 'User updated successfully' };
    } else {
      return { fail: true, message: 'User not found' };
    }
  }

  async changePassword(userId: number, password: string) {
    let user = await this.entityManager.findOne(User, { where: { userid: userId } });

    if (user) {
      await this.entityManager.update(User, user.userid, {
        pass: password
      });
      return { success: true, message: 'User updated password successfully' };
    } else {
      return { fail: true, message: 'User not found' };
    }
  }

  async changeAvatar(userId: number, avatar: string) {
    let user = await this.entityManager.findOne(User, { where: { userid: userId } });
    if (user) {
      await this.entityManager.update(User, user.userid, {
        userpath: avatar
      });
      return { success: true, message: 'User updated avatar successfully' };
    } else {
      return { fail: true, message: 'User not found' };
    }
  }

  async findAllUserCount() {
    return await this.entityManager
      .createQueryBuilder(User, 'u')
      .getCount();
  }

  async findAllUser() {
    return await this.entityManager
      .createQueryBuilder(User, 'u')
      .getMany();
  }

  async create(username: string, email: string, birthday: Date, gender: string, phone: string, pass: string, nation: string, city: string, addr: string, userpath: string, created: Date) {
    let user = await this.entityManager.findOne(User, {
      where: {
        email: email,
        phone: phone
      }
    });
    if (!user) {
      user = this.entityManager.create(User, {
        username: username,
        email: email,
        pass: pass,
        birthday: birthday,
        gender: gender,
        userpath: userpath,
        created: created,
        city: city,
        nation: nation,
        addr: addr,
        phone: phone
      })

      await this.entityManager.save(user);
      return { success: true, message: 'User created successfully' };
    } else {
      return { fail: true, message: 'User already exist' };
    }
  }

  async edit(username: string, email: string, birthday: Date, gender: string, phone: string, nation: string, city: string, addr: string, userpath: string, userid: number) {
    let user = await this.entityManager.findOne(User, { where: { userid: userid } });

    if (user) {
      await this.entityManager.update(User, user.userid, {
        username: username,
        email: email,
        birthday: birthday,
        gender: gender,
        userpath: userpath,
        city: city,
        nation: nation,
        addr: addr,
        phone: phone
      });
      return { success: true, message: 'User updated successfully' };
    } else {
      return { fail: true, message: 'User don\'t already exist' };
    }
  }

  async delete(userid: number) {
    let user = await this.entityManager.findOne(User, { where: { userid: userid } });

    if (user) {
      await this.entityManager.remove(user);
    } else {
      return { fail: true, message: 'User don\'t already exist' };
    }

    return { success: true, message: 'User deleted successfully' };
  }

  async findByEmail(email: string) {
    return await this.entityManager
      .createQueryBuilder(User, 'u')
      .where('u.email LIKE :email', { email: '%' + email + '%' })
      .getMany();
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    const hashedPassword = await hash(password, saltRounds);
    return hashedPassword;
  }

  async forgotPassword(newpassword: string, confirmpass: string, email: string) {
    return await this.entityManager.transaction(async (manager) => {
      let user = await this.entityManager.findOne(User, { where: { email: email } });
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      if (newpassword != confirmpass) {
        return { success: false, message: 'Password does not match' };
      }

      try {
        const hashedNewPassword = await this.hashPassword(newpassword);
        user.pass = hashedNewPassword;
        console.log('New password saved:', user.pass);
        await manager.save(user);
        return { success: true, message: 'User password updated successfully' };
      } catch (error) {
        console.error('Error saving new password:', error);
        return { success: false, message: 'Failed to update password' };
      }
    })
  }

  async getRegistrationCountPerMonth() {
    const currentYear = new Date().getFullYear();
  
    const result = await this.entityManager.query(`
      SELECT
        months.month,
        COALESCE(COUNT("users".userid), 0) AS registration_count
      FROM
        (SELECT generate_series(1, 12) AS month) AS months
        LEFT JOIN "users" 
        ON EXTRACT(MONTH FROM "users"."created") = months.month
        AND EXTRACT(YEAR FROM "users"."created") = $1
      GROUP BY months.month
      ORDER BY months.month;
    `, [currentYear]);
  
    return result.map(row => ({
      month: row.month,
      registrationCount: parseInt(row.registration_count, 10),
    }));
  }
}
