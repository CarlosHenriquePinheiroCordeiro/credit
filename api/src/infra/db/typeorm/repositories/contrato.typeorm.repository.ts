/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import { Parcela } from '../entities/parcela.entity';

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
    const queryBuilder = this.repo.createQueryBuilder('contratos');

    if (filter.contratoLike) {
      queryBuilder.andWhere('contratos.contrato ILIKE :contrato', {
        contrato: `%${filter.contratoLike}%`,
      });
    }
    if (filter.dataFrom)
      queryBuilder.andWhere('contratos.data >= :dataFrom', {
        dataFrom: filter.dataFrom,
      });
    if (filter.dataTo)
      queryBuilder.andWhere('contratos.data <= :dataTo', {
        dataTo: filter.dataTo,
      });
    if (filter.minValorTotal !== undefined)
      queryBuilder.andWhere('contratos.valortotal >= :minVal', {
        minVal: filter.minValorTotal,
      });
    if (filter.maxValorTotal !== undefined)
      queryBuilder.andWhere('contratos.valortotal <= :maxVal', {
        maxVal: filter.maxValorTotal,
      });
    if (filter.hasEntrada === true)
      queryBuilder.andWhere('contratos.valorentrada > 0');
    if (filter.hasEntrada === false)
      queryBuilder.andWhere('contratos.valorentrada = 0');

    const agg = queryBuilder
      .subQuery()
      .select('p.contratoId', 'contratoid')
      .addSelect('COUNT(*)::int', 'qtdparcelas')
      .addSelect('COALESCE(SUM(p.totalpago), 0)', 'totalpago')
      .from(Parcela, 'p')
      .groupBy('p.contratoId')
      .getQuery();

    queryBuilder
      .leftJoin(`(${agg})`, 'agg', 'agg.contratoid = contratos.contrato')
      .addSelect('agg.qtdparcelas', 'qtdparcelas')
      .addSelect('agg.totalpago', 'totalpago');

    const sortColumn = (() => {
      switch (pagination.sort) {
        case 'contrato':
          return 'contratos.contrato';
        case 'valortotal':
          return 'contratos.valortotal';
        case 'valorentrada':
          return 'contratos.valorentrada';
        case 'valorfinanciado':
          return 'contratos.valorfinanciado';
        case 'data':
        default:
          return 'contratos.data';
      }
    })();
    queryBuilder.orderBy(sortColumn, pagination.order ?? 'DESC');

    const page = Math.max(1, pagination.page);
    const limit = Math.min(100, Math.max(1, pagination.limit));
    queryBuilder.skip((page - 1) * limit).take(limit);

    const total = await queryBuilder
      .clone()
      .skip(undefined)
      .take(undefined)
      .getCount();

    const { entities, raw } = await queryBuilder.getRawAndEntities();

    entities.forEach((e, i) => {
      e.qtdParcelas = Number(raw[i]['qtdparcelas'] ?? 0);
      e.totalPago = Number(raw[i]['totalpago'] ?? 0);
    });

    const items = entities.map(ContratoMapper.toDomain);
    return { items, total, page, limit };
  }
}
