import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Tour } from 'src/tour/entities/tour.entity';
import { GroupWishlist } from 'src/groupwishlist/entities/groupwishlist.entity';

@Entity('wishlist')
export class Wishlist {
  @PrimaryGeneratedColumn()
  wishlistid: number;

  @Column('date')
  dayadd: Date;

  @ManyToOne(() => GroupWishlist, (gr) => gr.groupwishlistid, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'groupwishlistid'})
  groupwishlist: GroupWishlist;

  @ManyToOne(() => Tour, (tour) => tour.tourid, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tourid' })
  tour: Tour;
}
