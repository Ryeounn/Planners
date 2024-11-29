import { Attraction } from 'src/attraction/entities/attraction.entity';
import { City } from 'src/city/entities/city.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('region')
export class Region {
  @PrimaryGeneratedColumn()
  regionid: number;

  @Column({ length: 255 })
  regionname: string;

  @Column({length: 255})
  regionpath: string;
}
