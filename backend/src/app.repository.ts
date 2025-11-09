import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from './films/entities/film.entity';
import { Schedule } from './films/entities/schedule.entity';

@Injectable()
export class AppRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.filmRepository.find({
      relations: ['schedules'],
      order: {
        schedules: {
          daytime: 'ASC',
        },
      },
    });
  }

  async findSchedule(filmId: string): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: { filmId },
      order: { daytime: 'ASC' },
    });
  }

  async findFilmById(filmId: string): Promise<Film> {
    return this.filmRepository.findOne({
      where: { id: filmId },
      relations: ['schedules'],
    });
  }

  async updateScheduleTakenSeats(
    scheduleId: string,
    takenSeats: string,
  ): Promise<void> {
    await this.scheduleRepository.update(scheduleId, { taken: takenSeats });
  }
}
