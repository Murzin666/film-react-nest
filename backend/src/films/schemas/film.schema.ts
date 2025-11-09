import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class Schedule {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  daytime: Date;

  @Prop({ required: true })
  hall: number;

  @Prop({ required: true })
  rows: number;

  @Prop({ required: true })
  seats: number;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [String], default: [] })
  taken: string[];
}

@Schema()
export class Film extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  about: string;

  @Prop({ required: true })
  director: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  image: string;

  @Prop()
  cover: string;

  @Prop({ type: [Schedule], default: [] })
  schedule: Schedule[];
}

export const FilmSchema = SchemaFactory.createForClass(Film);
