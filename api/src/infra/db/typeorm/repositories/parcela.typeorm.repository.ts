/* eslint-disable @typescript-eslint/unbound-method */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IParcelaRepository,
  ListParcelasFilter,
  Pagination,
  Paginated,
} from '../../../../domain/parcela/parcela.repository';
import { Parcela as ParcelaEntity } from '../entities/parcela.entity';
import { ParcelaMapper } from '../../../mappers/parcela.mapper';
import { Parcela } from '../../../../domain/parcela/parcela.domain';

@Injectable()
export class ParcelaTypeOrmRepository implements IParcelaRepository {
  constructor(
    @InjectRepository(ParcelaEntity)
    private readonly repo: Repository<ParcelaEntity>,
  ) {}

  async list(
    filter: ListParcelasFilter,
    pagination: Pagination,
  ): Promise<Paginated<Parcela>> {
    const qb = this.repo.createQueryBuilder('p');

    qb.where('p.contratoId = :contratoId', { contratoId: filter.contratoId });

    if (filter.vencFrom)
      qb.andWhere('p.datavencimento >= :vFrom', { vFrom: filter.vencFrom });
    if (filter.vencTo)
      qb.andWhere('p.datavencimento <= :vTo', { vTo: filter.vencTo });

    if (filter.hasPayment === true) qb.andWhere('p.totalpago > 0');
    if (filter.hasPayment === false) qb.andWhere('p.totalpago = 0');

    if (filter.hasOpenCapital === true) qb.andWhere('p.capitalaberto > 0');
    if (filter.hasOpenCapital === false) qb.andWhere('p.capitalaberto = 0');

    const sortColumn = (() => {
      switch (pagination.sort) {
        case 'valorvencimento':
          return 'p.valorvencimento';
        case 'totalpago':
          return 'p.totalpago';
        case 'capitalaberto':
          return 'p.capitalaberto';
        case 'createdAt':
          return 'p.createdAt';
        case 'datavencimento':
        default:
          return 'p.datavencimento';
      }
    })();

    qb.orderBy(sortColumn, pagination.order ?? 'ASC');

    const page = Math.max(1, pagination.page);
    const limit = Math.min(100, Math.max(1, pagination.limit));
    qb.skip((page - 1) * limit).take(limit);

    const [rows, total] = await qb.getManyAndCount();
    const items = rows.map(ParcelaMapper.toDomain);

    return { items, total, page, limit };
  }
}
