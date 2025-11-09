import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
import { AppRepository } from '../app.repository';

@Injectable()
export class OrderService {
  constructor(private readonly appRepository: AppRepository) {}

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

      const filmData = await this.appRepository.findFilmById(film);
      if (!filmData) {
        throw new BadRequestException(`Фильм с id ${film} не найден`);
      }

      const sessionData = filmData.schedules.find((s) => s.id === session);
      if (!sessionData) {
        throw new BadRequestException(`Сеанс с id ${session} не найден`);
      }

      if (row > sessionData.rows || seat > sessionData.seats) {
        throw new BadRequestException(
          `Место ${row}:${seat} ограничено. В зале есть ${sessionData.rows} ряды и ${sessionData.seats} места`,
        );
      }

      const seatKey = `${row}:${seat}`;

      if (sessionData.taken && sessionData.taken.includes(seatKey)) {
        throw new ConflictException(`Место ${seatKey} уже занято`);
      }

      const updatedTaken = sessionData.taken
        ? `${sessionData.taken},${seatKey}`
        : seatKey;

      await this.appRepository.updateScheduleTakenSeats(session, updatedTaken);

      const orderData = {
        filmId: film,
        sessionId: session,
        row,
        seat,
        email,
        phone,
        price: ticket.price,
      };

      orders.push(orderData);
    }

    return orders;
  }
}
