import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Wishlist } from 'src/wishlist/entities/wishlist.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('groupwishlist')
export class GroupWishlist {
  @PrimaryGeneratedColumn()
  groupwishlistid: number;

  @Column({ length: 255 })
  groupname: string;

  @Column('date')
  createddate: Date;

  @ManyToOne(() => User, (user) => user.userid, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userid' }) 
  user: User;
}
