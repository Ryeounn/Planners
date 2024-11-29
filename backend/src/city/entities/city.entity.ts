import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Region } from 'src/region/entities/region.entity';

@Entity('city')
export class City {
  @PrimaryGeneratedColumn()
  cityid: number;

  @Column({ length: 255 })
  cityname: string;

  @ManyToOne(() => Region, (region) => region.regionid, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'regionid' })
  region: Region;
}
