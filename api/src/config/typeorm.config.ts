import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { env } from './env';
import { Contrato } from '../infra/db/typeorm/entities/contrato.entity';
import { Parcela } from '../infra/db/typeorm/entities/parcela.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.user,
  password: env.db.pass,
  database: env.db.name,
  entities: [Contrato, Parcela],
};

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async () => typeOrmConfig,
};
