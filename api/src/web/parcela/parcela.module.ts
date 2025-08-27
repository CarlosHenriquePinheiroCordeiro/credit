import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParcelasController } from './parcela.controller';
import { Parcela } from '../../infra/db/typeorm/entities/parcela.entity';
import { ParcelaTypeOrmRepository } from '../../infra/db/typeorm/repositories/parcela.typeorm.repository';
import { ListParcelasUseCase } from '../../application/parcela/list-parcelas.usecase';
import { PARCELA_REPOSITORY } from '../../domain/parcela/parcela.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Parcela])],
  controllers: [ParcelasController],
  providers: [
    ListParcelasUseCase,
    { provide: PARCELA_REPOSITORY, useClass: ParcelaTypeOrmRepository },
  ],
  exports: [],
})
export class ParcelasModule {}
