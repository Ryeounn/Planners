import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Blog } from 'src/blog/entities/blog.entity';
import { BlogImages } from 'src/blogimages/entities/blogimage.entity';

@Entity('paragraphs')
export class Paragraphs {
  @PrimaryGeneratedColumn()
  paragraphsid: number;

  @Column('text')
  content: string;

  @Column('int')
  position: number;

  @ManyToOne(() => Blog, (blog) => blog.blogid, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogid' })
  blog: Blog;

  @ManyToOne(() => BlogImages, (blogImage) => blogImage.blogimageid, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogimageid' }) 
  blogImage: BlogImages;
}
