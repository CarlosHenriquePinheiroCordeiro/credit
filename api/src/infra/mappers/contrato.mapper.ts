import { Contrato as ContratoEntity } from '../db/typeorm/entities/contrato.entity';
import { Contrato } from '../../domain/contrato/contrato.domain';

export class ContratoMapper {
  static toDomain(e: ContratoEntity): Contrato {
    return new Contrato(
      e.contrato,
      new Date(e.data),
      e.valortotal,
      e.valorentrada,
      e.valorfinanciado,
      e.createdAt,
      e.updatedAt,
    );
  }
}
