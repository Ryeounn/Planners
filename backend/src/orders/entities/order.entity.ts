import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Admin } from 'src/admins/entities/admin.entity';

@Entity('orders')
export class Orders {
  @PrimaryGeneratedColumn()
  orderid: number;

  @Column('int')
  ordercode: number;

  @Column('date')
  orderdate: Date;

  @Column('int')
  totalquantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalprice: number;

  @Column({ length: 255 })
  condition: string;

  @Column({length: 255})
  isseen: string;

  @ManyToOne(() => User, (user) => user.userid, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userid' })
  user: User;

  @ManyToOne(() => Admin, (admin) => admin.adminid, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'adminid' })
  admin: Admin;
}
