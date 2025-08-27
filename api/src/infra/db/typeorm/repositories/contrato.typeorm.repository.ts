/* eslint-disable @typescript-eslint/unbound-method */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contrato } from 'src/domain/contrato/contrato.domain';
import { Contrato as ContratoEntity } from '../entities/contrato.entity';
import { ContratoMapper } from 'src/infra/mappers/contrato.mapper';
import {
  IContratoRepository,
  ListContratosFilter,
  Paginated,
  Pagination,
} from 'src/domain/contrato/contrato.repository';

@Injectable()
export class ContratoTypeOrmRepository implements IContratoRepository {
  constructor(
    @InjectRepository(Contrato)
    private readonly repo: Repository<ContratoEntity>,
  ) {}

  async list(
    filter: ListContratosFilter,
    pagination: Pagination,
  ): Promise<Paginated<Contrato>> {
    const qb = this.repo.createQueryBuilder('c');

    if (filter.contratoLike) {
      qb.andWhere('c.contrato ILIKE :contrato', {
        contrato: `%${filter.contratoLike}%`,
      });
    }
    if (filter.dataFrom) {
      qb.andWhere('c.data >= :dataFrom', { dataFrom: filter.dataFrom });
    }
    if (filter.dataTo) {
      qb.andWhere('c.data <= :dataTo', { dataTo: filter.dataTo });
    }
    if (filter.minValorTotal !== undefined) {
      qb.andWhere('c.valortotal >= :minVal', { minVal: filter.minValorTotal });
    }
    if (filter.maxValorTotal !== undefined) {
      qb.andWhere('c.valortotal <= :maxVal', { maxVal: filter.maxValorTotal });
    }
    if (filter.hasEntrada === true) qb.andWhere('c.valorentrada > 0');
    if (filter.hasEntrada === false) qb.andWhere('c.valorentrada = 0');

    const sortColumn = (() => {
      switch (pagination.sort) {
        case 'contrato':
          return 'c.contrato';
        case 'valortotal':
          return 'c.valortotal';
        case 'valorentrada':
          return 'c.valorentrada';
        case 'valorfinanciado':
          return 'c.valorfinanciado';
        case 'data':
        default:
          return 'c.data';
      }
    })();

    qb.orderBy(sortColumn, pagination.order ?? 'DESC');

    const page = Math.max(1, pagination.page);
    const limit = Math.min(100, Math.max(1, pagination.limit));
    qb.skip((page - 1) * limit).take(limit);

    const [rows, total] = await qb.getManyAndCount();
    const items = rows.map(ContratoMapper.toDomain);

    return { items, total, page, limit };
  }
}
