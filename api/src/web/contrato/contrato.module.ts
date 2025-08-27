import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContratoController } from './contrato.controller';
import { Contrato } from '../../infra/db/typeorm/entities/contrato.entity';
import { ContratoTypeOrmRepository } from '../../infra/db/typeorm/repositories/contrato.typeorm.repository';
import { ListContratosUseCase } from 'src/application/contrato/list-contratos.usecase';
import { CONTRATO_REPOSITORY } from 'src/domain/contrato/contrato.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Contrato])],
  controllers: [ContratoController],
  providers: [
    ListContratosUseCase,
    { provide: CONTRATO_REPOSITORY, useClass: ContratoTypeOrmRepository },
  ],
})
export class ContratosModule {}
