import 'reflect-metadata';
import { env } from '../../../config/env';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  url: `${env.db.type}://${env.db.user}:${env.db.pass}@localhost:${env.db.port}/${env.db.name}`,
  entities: ['src/**/*.entity.{ts,js}'],
  migrations: ['src/infra/db/migrations/*.{ts,js}'],
  synchronize: false,
  logging: false,
});
