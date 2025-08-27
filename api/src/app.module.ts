import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ContratoModule } from './contrato/contrato.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [join(__dirname, '**/*.entity.{ts,js}')],
        synchronize: false,
      }),
    }),
    ContratoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
