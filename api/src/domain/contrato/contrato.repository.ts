import { Contrato } from './contrato.domain';

export type ListContratosFilter = {
  contratoLike?: string;
  dataFrom?: Date;
  dataTo?: Date;
  minValorTotal?: number;
  maxValorTotal?: number;
  hasEntrada?: boolean;
};

export type Pagination = {
  page: number;
  limit: number;
  sort?:
    | 'data'
    | 'contrato'
    | 'valortotal'
    | 'valorentrada'
    | 'valorfinanciado';
  order?: 'ASC' | 'DESC';
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export const CONTRATO_REPOSITORY = Symbol('CONTRATO_REPOSITORY');

export interface IContratoRepository {
  list(
    filter: ListContratosFilter,
    pagination: Pagination,
  ): Promise<Paginated<Contrato>>;
}
