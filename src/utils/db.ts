import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { logError, logInfo } from '../Logger/logger';
import { config } from '../config/config';
import { User } from '../entities/User';
import { Product } from '../entities/Product';
import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import { CartItem } from '../entities/CartItem';
dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: String(config.DB_HOST),
  port: Number(config.DB_PORT),
  username: String(config.DB_USERNAME),
  password: String(config.DB_PASSWORD),
  database: String(config.DB_NAME),
  synchronize: false,
  logging: false,
  entities: [User,Order,OrderItem,CartItem,Product],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});

export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    logInfo('Database connected successfully');
  } catch (error) {
    logError(`Database connection failed${error}`);
  }
};

export default AppDataSource;
