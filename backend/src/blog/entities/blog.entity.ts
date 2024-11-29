import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Admin } from 'src/admins/entities/admin.entity';

@Entity('blog')
export class Blog {
  @PrimaryGeneratedColumn()
  blogid: number;

  @Column({ length: 255 })
  title: string;

  @Column('date')
  created: Date;

  @Column('date')
  updated: Date;

  @Column({length: 255})
  locations: string;

  @Column({length: 255})
  blogimg: string;

  @Column({length: 255})
  descript: string

  @ManyToOne(() => Admin, (admin) => admin.adminid, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'adminid' })
  admin: Admin;
}
