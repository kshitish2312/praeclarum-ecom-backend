import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity("order_items")
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  order!: Order;

  @ManyToOne(() => Product, (product) => product.orderItems, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  product!: Product;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "decimal" })
  price!: number;
}
