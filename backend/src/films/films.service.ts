import { Injectable } from '@nestjs/common';
import { AppRepository } from '../app.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly appRepository: AppRepository) {}

  async findAll() {
    return this.appRepository.findAll();
  }

  async findSchedule(filmId: string) {
    return this.appRepository.findSchedule(filmId);
  }
}
