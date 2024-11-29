import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Admin } from 'src/admins/entities/admin.entity';
import { Paragraphs } from 'src/paragraphs/entities/paragraph.entity';
import { BlogImages } from 'src/blogimages/entities/blogimage.entity';

@Injectable()
export class BlogService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  findOne(id: number) {
    return `This action returns a #${id} blog`;
  }


  remove(id: number) {
    return `This action removes a #${id} blog`;
  }

  findLocations = async () => {
    return this.entityManager
      .createQueryBuilder(Blog, 'blog')
      .getMany();
  }

  findAll = async () => {
    return await this.entityManager
      .createQueryBuilder(Blog, 'blog')
      .innerJoinAndSelect('blog.admin', 'a')
      .orderBy('blog.created', 'ASC')
      .getMany();
  }

  async findAllByCode(keyword: string){
    return await this.entityManager
    .createQueryBuilder(Blog, 'blog')
    .innerJoinAndSelect('blog.admin', 'a')
    .where('blog.title LIKE :keyword', {keyword: "%" + keyword + "%"})
    .orderBy('blog.created', 'ASC')
    .getMany();
  }

  findAllOrderDesc = async () => {
    return this.entityManager
      .createQueryBuilder(Blog, 'blog')
      .innerJoinAndSelect('blog.admin', 'a')
      .orderBy('blog.created', 'DESC')
      .getMany();
  }

  async create(name: string, location: string, images: string, content: string, adminid: number,
    paragraphs: {
      content: string;
      position: number;
      image: string;
    }[]) {
    return await this.entityManager.transaction(async (manager) => {
      const admin = await manager.findOne(Admin, { where: { adminid } });
      const blog = await manager.create(Blog, {
        title: name,
        created: new Date(),
        updated: new Date(),
        locations: location,
        blogimg: images,
        descript: content,
        admin: admin
      });

      const savedBlog = await manager.save(blog);

      const blogId = savedBlog.blogid;

      const blogImageEntities = paragraphs.map((para, index) =>
        manager.create(BlogImages, {
          position: index + 1,
          imagepath: para.image,
        }),
      );

      const savedBlogImages = await manager.save(blogImageEntities);

      const paragraphEntities = paragraphs.map((para, index) =>
        manager.create(Paragraphs, {
          content: para.content,
          position: para.position,
          blog: savedBlog,
          blogImage: savedBlogImages[index],
        }),
      );

      await manager.save(paragraphEntities);

      return {
        message: 'Blog, images, and paragraphs created successfully',
        blogId,
      };
    });
  }

  async findById(blogid: number){
    return this.entityManager
    .createQueryBuilder(Blog,'blog')
    .innerJoinAndSelect('blog.admin','ad')
    .where('blog.blogid =:blogid', {blogid})
    .getOne();
  }

  async edit(name: string, location: string, images: string, content: string, blogid: number,
    paragraphs: {
      paragraphid: number;
      content: string;
      position: number;
      image: string;
      blogimageid: number;
    }[]){
    await this.entityManager.transaction(async (manager) => {
      const blog = await manager.findOne(Blog, { where: { blogid } });
      if (!blog) {
        throw new Error('Blog not found');
      }

      blog.title = name;
      blog.locations = location;
      blog.blogimg = images;
      blog.descript = content;
      blog.updated = new Date();

      await manager.save(blog);

      for (const para of paragraphs) {
        const paragraph = await manager.findOne(Paragraphs, {
          where: { paragraphsid: para.paragraphid },
        });

        console.log(paragraph);
        if (paragraph) {
          paragraph.content = para.content;
          paragraph.position = para.position;

          if (para.blogimageid) {
            const blogImage = await manager.findOne(BlogImages, {
              where: { blogimageid: para.blogimageid },
            });
            if (blogImage) {
              paragraph.blogImage = blogImage;
            }
          }

          await manager.save(paragraph);
        }
      }
    });
  }

  async delete(blogid: number){
    await this.entityManager.transaction(async (manager) => {
      const blog = await manager.findOne(Blog, { where: { blogid } });
      if (!blog) {
        throw new Error("Blog not found");
      }
  
      const paragraphs = await manager.find(Paragraphs, {
        where: { blog: { blogid } },
        relations: ["blogImage"],
      });
  
      for (const paragraph of paragraphs) {
        if (paragraph.blogImage) {
          paragraph.blogImage = null;
          await manager.save(paragraph);
          console.log(`Set blogImage to null for paragraph ${paragraph.paragraphsid}`);
        }
      }
  
      for (const paragraph of paragraphs) {
        if (paragraph.blogImage) {
          await manager.delete(BlogImages, { blogimageid: paragraph.blogImage.blogimageid });
          console.log(`Deleted blogImage with id ${paragraph.blogImage.blogimageid}`);
        }
      }
  
      await manager.delete(Paragraphs, { blog: { blogid } });
      console.log(`Deleted paragraphs for blogid ${blogid}`);
  
      await manager.delete(Blog, { blogid });
      console.log(`Deleted blog with id ${blogid}`);
    });
  }
}
