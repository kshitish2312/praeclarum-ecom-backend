import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { Product } from './Product';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => User, (user) => user.cartItems,{ onDelete: "CASCADE", onUpdate: "CASCADE" })
    user!: User;

  @ManyToOne(() => Product, (product) => product.cartItems,{ onDelete: "CASCADE", onUpdate: "CASCADE" })
    product!: Product;

  @Column({ type: 'int' })
    quantity!: number;
}
