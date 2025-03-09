import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert
} from "typeorm";
import bcrypt from 'bcryptjs';
import { Order } from "./Order";
import { CartItem } from "./CartItem";

export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.CUSTOMER })
  role!: UserRole;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => Order, (order) => order.user,{ onDelete: "CASCADE", onUpdate: "CASCADE" })
  orders!: Order[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.user,{ onDelete: "CASCADE", onUpdate: "CASCADE" })
  cartItems!: CartItem[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
