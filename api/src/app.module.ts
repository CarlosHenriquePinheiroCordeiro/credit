import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContratosModule } from './web/contrato/contrato.module';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { ParcelasModule } from './web/parcela/parcela.module';
import { MaximoAbertoModule } from './web/maximo-aberto/maximo-aberto.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ContratosModule,
    ParcelasModule,
    MaximoAbertoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
