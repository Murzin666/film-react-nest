import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  filmId: string;

  @Column('uuid')
  sessionId: string;

  @Column('int')
  row: number;

  @Column('int')
  seat: number;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column('int')
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
