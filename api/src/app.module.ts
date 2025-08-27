import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContratosModule } from './web/contrato/contrato.module';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { ParcelasModule } from './web/parcela/parcela.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ContratosModule,
    ParcelasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
