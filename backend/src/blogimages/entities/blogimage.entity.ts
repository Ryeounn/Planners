import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('blogimages')
export class BlogImages {
  @PrimaryGeneratedColumn()
  blogimageid: number;

  @Column('int')
  position: number;

  @Column({ length: 255 })
  imagepath: string;
}
