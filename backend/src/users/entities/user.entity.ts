import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    userid: Number;

    @Column({ length: 255 })
    username: String;

    @Column({ length: 255 })
    email: String;

    @Column({ length: 255 })
    pass: String;

    @Column('date')
    birthday: Date;

    @Column({ length: 255 })
    gender: string;

    @Column({ length: 255, })
    userpath: string;

    @Column('date')
    created: Date;

    @Column({ length: 255 })
    city: string;

    @Column({ length: 255 })
    nation: string;

    @Column({ length: 255 })
    addr: string;

    @Column({ length: 255 })
    phone: string;
}
