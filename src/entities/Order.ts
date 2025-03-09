import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { OrderItem } from './OrderItem';

export enum OrderStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => User, (user) => user.orders)
    user!: User;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    status!: OrderStatus;

  @CreateDateColumn()
    created_at!: Date;

  @UpdateDateColumn()
    updated_at!: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    orderItems!: OrderItem[];
}
