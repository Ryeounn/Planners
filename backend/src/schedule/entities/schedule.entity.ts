import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tour } from 'src/tour/entities/tour.entity';

@Entity('schedule')
export class Schedule {
  @PrimaryGeneratedColumn()
  scheduleid: number;

  @Column('int')
  daynumber: number;

  @Column('text')
  morplan: string;

  @Column('text')
  mordes: string;

  @Column({ length: 255 })
  morimg: string;

  @Column('text')
  afterplan: string;

  @Column('text')
  afterdes: string;

  @Column({ length: 255 })
  afterimg: string;

  @Column('text')
  evenplan: string;

  @Column('text')
  evendes: string;

  @Column({ length: 255 })
  evenimg: string;

  @ManyToOne(() => Tour, (tour) => tour.tourid, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tourid' })
  tour: Tour;
}
