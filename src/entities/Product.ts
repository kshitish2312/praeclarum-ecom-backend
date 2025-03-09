import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { OrderItem } from './OrderItem';
import { CartItem } from './CartItem';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    name!: string;

  @Column({ type: 'decimal' })
    price!: number;

  @Column({ type: 'int' })
    stock!: number;

  @Column('text', { array: true }) // Storing images as an array of URLs
    images!: string[];

  @Column({ type: 'text' })
    description!: string;

  @CreateDateColumn()
    created_at!: Date;

  @UpdateDateColumn()
    updated_at!: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product,{ onDelete: "CASCADE", onUpdate: "CASCADE" })
    orderItems!: OrderItem[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product,{ onDelete: "CASCADE", onUpdate: "CASCADE" })
    cartItems!: CartItem[];
}
