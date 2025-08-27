/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Parcela as ParcelaEntity } from '../db/typeorm/entities/parcela.entity';
import { Parcela } from 'src/domain/parcela/parcela.domain';

export class ParcelaMapper {
  static toDomain(e: ParcelaEntity): Parcela {
    return new Parcela(
      e.contratoId,
      new Date(e.datavencimento),
      e.valorvencimento,
      e.dataultimopagamento ? new Date(e.dataultimopagamento) : null,
      e.totalpago,
      e.capitalaberto,
      e.createdAt,
      e.updatedAt,
    );
  }
}
