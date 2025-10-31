import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/order.dto';
import { Order } from './schemas/order.schema';
import { FilmsService } from '../films/films.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly filmsService: FilmsService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { email, phone, tickets } = createOrderDto;

    if (!tickets || tickets.length === 0) {
      throw new BadRequestException('Билетов нет');
    }

    const orders = [];

    for (const ticket of tickets) {
      const { film, session, row, seat } = ticket;

      if (row <= 0 || seat <= 0) {
        throw new BadRequestException(
          'Ряд и сидение не могут быть отрицаательными',
        );
      }

      const allFilms = await this.filmsService.findAll();
      const filmData = allFilms.find((f) => f.id === film);

      if (!filmData) {
        throw new BadRequestException(`Фильм с id ${film} не найден`);
      }

      const sessionData = filmData.schedule.find((s) => s.id === session);
      if (!sessionData) {
        throw new BadRequestException(`Сеанс с id ${session} не найден`);
      }

      if (row > sessionData.rows || seat > sessionData.seats) {
        throw new BadRequestException(
          `Место ${row}:${seat} ограничено. В зале есть ${sessionData.rows} ряды и ${sessionData.seats} места`,
        );
      }

      const seatKey = `${row}:${seat}`;

      if (sessionData.taken.includes(seatKey)) {
        throw new ConflictException(`Место ${seatKey} уже занято`);
      }

      const existingOrder = await this.orderModel.findOne({
        filmId: film,
        sessionId: session,
        row,
        seat,
      });

      if (existingOrder) {
        throw new ConflictException(`Место ${seatKey} уже занято`);
      }

      const updatedTaken = [...sessionData.taken, seatKey];
      await this.updateSessionTakenSeats(film, session, updatedTaken);

      const orderData = {
        filmId: film,
        sessionId: session,
        row,
        seat,
        email,
        phone,
        price: ticket.price,
      };

      const createdOrder = new this.orderModel(orderData);
      const savedOrder = await createdOrder.save();
      orders.push(savedOrder);
    }

    return orders;
  }

  private async updateSessionTakenSeats(
    filmId: string,
    sessionId: string,
    takenSeats: string[],
  ): Promise<void> {
    const filmModel = this.filmsService['filmModel'];
    await filmModel.findOneAndUpdate(
      { id: filmId, 'schedule.id': sessionId },
      { $set: { 'schedule.$.taken': takenSeats } },
    );
  }
}
