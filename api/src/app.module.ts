import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContratosModule } from './web/contrato/contrato.module';
import { typeOrmAsyncConfig } from './config/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRootAsync(typeOrmAsyncConfig), ContratosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
