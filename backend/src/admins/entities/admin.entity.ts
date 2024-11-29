import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  adminid: number;

  @Column({ length: 255 })
  email: string;

  @Column({length: 255})
  adminname: string;

  @Column({ length: 255 })
  pass: string;

  @Column({ length: 255 })
  gender: string;

  @Column('date')
  birthday: Date;

  @Column({ length: 255 })
  adminpath: string;
}
