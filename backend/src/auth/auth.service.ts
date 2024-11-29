import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Admin } from 'src/admins/entities/admin.entity';
import { hash, compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
    @InjectEntityManager()
    private entityManager: EntityManager;
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService
    ) { }

    async validateGoogleUser(profile: any): Promise<any> {
        const user = await this.usersService.findOrCreateGoogleUser(profile);
        return user;
    }

    async generateJwt(user: any) {
        const payload = { email: user.email, sub: user.id };
        return this.jwtService.sign(payload);
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 12;
        const hashedPassword = await hash(password, saltRounds);
        return hashedPassword;
    }

    async findLogin(email: string, password: string) {
        const user = await this.entityManager
            .createQueryBuilder(User, 'user')
            .where('user.email = :email', { email })
            .getOne();

        const admin = await this.entityManager
            .createQueryBuilder(Admin, 'admin')
            .where('admin.email = :email', { email })
            .getOne();

        if (user) {
            const isMatch = await compare(password, user.pass);
            if (isMatch) {
                const payload = { email: user.email, sub: user.userid, role: 'user' };
                const token = this.jwtService.sign(payload);
                console.log('a');
                return { token, user };
            } else {
                throw new Error('Invalid user credentials');
            }
        } else if (admin) {
            const isMatch = await compare(password, admin.pass);
            if (isMatch) {
                const payload = { email: admin.email, sub: admin.adminid, role: 'admin' };
                const token = this.jwtService.sign(payload);
                console.log('b');
                return { token, admin };
            } else {
                throw new Error('Invalid admin credentials');
            }
        } else {
            throw new Error('The account is not in the system');
        }
    }
}
