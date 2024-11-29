import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { Tour } from 'src/tour/entities/tour.entity';

@Injectable()
export class ScheduleService {

  @InjectEntityManager()
  private entityManager: EntityManager;

  findAll() {
    return `This action returns all schedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }

  findScheduleById = async () => {
    return await this.entityManager
      .createQueryBuilder(Schedule, 'schedule')
      .innerJoinAndSelect('schedule.tour', 'tourid')
      .where('schedule.tourid = :id', { id: 4 })
      .getMany();
  }

  async findByTourId(id: number) {
    return await this.entityManager
      .createQueryBuilder(Schedule, 'schedule')
      .where('schedule.tourid = :id', { id })
      .getMany();
  }

  async create(tourid: number, schedules: any) {
    const newSchedules = await this.entityManager.transaction(async (manager) => {

      const tour = await manager.findOne(Tour, { where: { tourid } });

      if (!tour) {
        throw new Error('Tour không tồn tại');
      }

      const existingSchedules = await manager.find(Schedule, { where: { tour } });

      if (existingSchedules.length > 0) {
        throw new Error('Tour đã có lịch trình, không thể thêm lịch trình mới');
      } else {
        const scheduleEntities = schedules.map((schedule: any) => {
          const newSchedule = manager.create(Schedule, {
            ...schedule,
            tour,
          });
          return newSchedule;
        });

        await manager.save(Schedule, scheduleEntities);

        return { success: true, message: 'Created schedule successfully' };
      }
    });
    return newSchedules;
  }

  async edit(tourid: number, schedules: any) {
    try {
      const editedSchedules = await this.entityManager.transaction(async (manager) => {
        const tour = await manager.findOne(Tour, { where: { tourid } });

        if (!tour) {
          throw new Error('Tour không tồn tại');
        }

        const existingSchedules = await manager.find(Schedule, { where: { tour } });

        if (existingSchedules.length === 0) {
          return { success: false, message: 'Sửa lịch trình thất bại' };
        } else {
          existingSchedules.forEach((existingSchedule, index) => {
            const updatedSchedule = schedules[index];

            if (updatedSchedule) {
              existingSchedule.daynumber = updatedSchedule.daynumber || existingSchedule.daynumber;
              existingSchedule.morplan = updatedSchedule.morplan || existingSchedule.morplan;
              existingSchedule.mordes = updatedSchedule.mordes || existingSchedule.mordes;
              existingSchedule.morimg = updatedSchedule.morimg || existingSchedule.morimg;
              existingSchedule.afterplan = updatedSchedule.afterplan || existingSchedule.afterplan;
              existingSchedule.afterdes = updatedSchedule.afterdes || existingSchedule.afterdes;
              existingSchedule.afterimg = updatedSchedule.afterimg || existingSchedule.afterimg;
              existingSchedule.evenplan = updatedSchedule.evenplan || existingSchedule.evenplan;
              existingSchedule.evendes = updatedSchedule.evendes || existingSchedule.evendes;
              existingSchedule.evenimg = updatedSchedule.evenimg || existingSchedule.evenimg;
            }
          });

          await manager.save(Schedule, existingSchedules);

          return { success: true, message: 'Cập nhật lịch trình thành công' };
        }
      });

      return editedSchedules;
    } catch (error) {
      console.error('Lỗi trong quá trình cập nhật:', error);
      return { success: false, message: 'Đã xảy ra lỗi trong quá trình cập nhật lịch trình' };
    }
  }


  async findByTourIds(tourid: number) {
    return await this.entityManager
      .createQueryBuilder(Schedule, 's')
      .where('s.tourid =:tourid', { tourid })
      .getMany();
  }

  async delete(tourid: number){
    const editedSchedules = await this.entityManager.transaction(async (manager) => {
      const tour = await manager.findOne(Tour, { where: { tourid } });

      const existingSchedules = await manager.find(Schedule, { where: { tour } });

      if (existingSchedules.length === 0) {
        return { success: false, message: 'Xóa lịch trình thất bại' };
      } else {
        existingSchedules.forEach((existingSchedule) => {
           manager.remove(existingSchedule);
        })
        return { success: true, message: 'Xóa lịch trình thành công' };
      }
    });
  }
}
