import 'reflect-metadata';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  url: process.env.LOCAL_DATABASE_URL,
  entities: ['src/**/*.entity.{ts,js}'],
  migrations: ['src/db/migrations/*.{ts,js}'],
  synchronize: false,
  logging: false,
});
