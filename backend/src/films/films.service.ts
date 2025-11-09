import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from './schemas/film.schema';

@Injectable()
export class FilmsService {
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

  async findAll() {
    return this.filmModel.find().exec();
  }

  async findSchedule(filmId: string) {
    const film = await this.filmModel.findOne({ id: filmId }).exec();
    return film ? film.schedule : [];
  }
}
