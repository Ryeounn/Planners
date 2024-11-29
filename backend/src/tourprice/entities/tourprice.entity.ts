import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tour } from 'src/tour/entities/tour.entity';
import { Age } from 'src/age/entities/age.entity';

@Entity('tourprice')
export class TourPrice {
  @PrimaryGeneratedColumn()
  tourpriceid: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Tour, (tour) => tour.tourid, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tourid' })
  tour: Tour;

  @ManyToOne(() => Age, (age) => age.ageid, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ageid' })
  age: Age;
}
