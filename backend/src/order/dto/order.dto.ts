import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  IsArray,
  ValidateNested,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

class TicketDto {
  @IsString()
  @IsNotEmpty()
  film: string;

  @IsString()
  @IsNotEmpty()
  session: string;

  @IsNumber()
  @Min(1)
  row: number;

  @IsNumber()
  @Min(1)
  seat: number;

  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}
