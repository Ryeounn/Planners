import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('age')
export class Age {
  @PrimaryGeneratedColumn()
  ageid: number;

  @Column({ length: 255 })
  agegroup: string;

  @Column('int')
  minage: number;

  @Column('int')
  maxage: number;
}
