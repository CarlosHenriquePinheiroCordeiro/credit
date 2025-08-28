import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContratoController } from './contrato.controller';
import { Contrato } from '../../infra/db/typeorm/entities/contrato.entity';
import { Parcela } from '../../infra/db/typeorm/entities/parcela.entity';
import { ContratoTypeOrmRepository } from '../../infra/db/typeorm/repositories/contrato.typeorm.repository';
import { ParcelaTypeOrmRepository } from '../../infra/db/typeorm/repositories/parcela.typeorm.repository';
import { ListContratosUseCase } from '../../../src/application/contrato/list-contratos.usecase';
import { GetEndividamentoTotalUseCase } from '../../../src/application/contrato/get-endividamento-total.usecase';
import { CONTRATO_REPOSITORY } from '../../../src/domain/contrato/contrato.repository';
import { PARCELA_REPOSITORY } from '../../../src/domain/parcela/parcela.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Contrato, Parcela])],
  controllers: [ContratoController],
  providers: [
    ListContratosUseCase,
    GetEndividamentoTotalUseCase,
    { provide: CONTRATO_REPOSITORY, useClass: ContratoTypeOrmRepository },
    { provide: PARCELA_REPOSITORY, useClass: ParcelaTypeOrmRepository },
  ],
})
export class ContratosModule {}
