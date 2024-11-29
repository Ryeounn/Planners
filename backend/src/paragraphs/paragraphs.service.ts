import { Injectable } from '@nestjs/common';
import { CreateParagraphDto } from './dto/create-paragraph.dto';
import { UpdateParagraphDto } from './dto/update-paragraph.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Paragraphs } from './entities/paragraph.entity';

@Injectable()
export class ParagraphsService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  create(createParagraphDto: CreateParagraphDto) {
    return 'This action adds a new paragraph';
  }

  findAll() {
    return `This action returns all paragraphs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paragraph`;
  }

  update(id: number, updateParagraphDto: UpdateParagraphDto) {
    return `This action updates a #${id} paragraph`;
  }

  remove(id: number) {
    return `This action removes a #${id} paragraph`;
  }

  findBlogByName = async (name: any) => {
    try {
      const blogTitle = name.title[0];
      const formattedName = blogTitle.replace(/-/g, ' ');
      const blogDetail = await this.entityManager
        .createQueryBuilder(Paragraphs, 'paragraphs')
        .innerJoinAndSelect('paragraphs.blog', 'blogid')
        .where('blogid.title = :name', { name: formattedName })
        .getOne();
      if (!blogDetail) {
        throw new Error('Blog not found');
      }
      return blogDetail;
    } catch (error) {
      console.error('Error finding blog:', error);
      throw error;
    }
  }

  findAllParagraphById = async(id: number) =>{
    return this.entityManager
    .createQueryBuilder(Paragraphs, 'paragraphs')
    .where('paragraphs.blogid = :id',{id: id})
    .innerJoinAndSelect('paragraphs.blogImage','blogimageid')
    .getMany();
  }

  async findAllById(blogids: number[]){
    return this.entityManager
    .createQueryBuilder(Paragraphs,'p')
    .innerJoinAndSelect('p.blogImage','bi')
    .innerJoinAndSelect('p.blog','b')
    .where('p.blog IN (:...blogids)', {blogids})
    .orderBy('p.position', 'ASC')
    .getMany();
  }

  async findById(blogid: number){
    return this.entityManager
    .createQueryBuilder(Paragraphs, 'p')
    .innerJoinAndSelect('p.blogImage','bi')
    .where('p.blog =:blogid', {blogid})
    .getMany();
  }
}
