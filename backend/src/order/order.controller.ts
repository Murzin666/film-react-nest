import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const result = await this.orderService.create(createOrderDto);
      return {
        items: result,
      };
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }
}
