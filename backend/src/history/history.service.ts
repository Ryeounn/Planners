import { Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Tour } from 'src/tour/entities/tour.entity';
import { History } from './entities/history.entity';

@Injectable()
export class HistoryService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  create(createHistoryDto: CreateHistoryDto) {
    return 'This action adds a new history';
  }

  findAll() {
    return `This action returns all history`;
  }

  findOne(id: number) {
    return `This action returns a #${id} history`;
  }

  update(id: number, updateHistoryDto: UpdateHistoryDto) {
    return `This action updates a #${id} history`;
  }

  remove(id: number) {
    return `This action removes a #${id} history`;
  }

  async findAllByUserId(userid: number){
    return await this.entityManager
    .createQueryBuilder(History, 'history')
    .innerJoinAndSelect('history.tour', 'tourid')
    .where('history.userid = :userid', {userid})
    .getMany();
  }

  async createHistory(tourid: number, userid: number, viewed: Date){
    return await this.entityManager.transaction(async(manager) =>{
      const user = await manager.findOne(User, { where: { userid: userid } });
      const tour = await manager.findOne(Tour, { where: { tourid: tourid } });
      try{
        const existingHistory = await manager.findOne(History, {
          where: {
            tour: tour,
            user: user,
          },
        });

        if (existingHistory) {
          console.log('History already exists for this user and tour.');
          return;
        }

        const history = manager.create(History,{
          tour: tour,
          user: user,
          viewed: viewed,
        });

        await manager.save(history);
      }catch(err){
        console.log('Error create: ' + err);
      }
    })
  }
}
