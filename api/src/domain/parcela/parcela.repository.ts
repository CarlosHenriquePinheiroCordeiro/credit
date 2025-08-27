import { Parcela } from './parcela.domain';

export type ListParcelasFilter = {
  contratoId: string;
  vencFrom?: Date;
  vencTo?: Date;
  hasPayment?: boolean;
  hasOpenCapital?: boolean;
};

export type Pagination = {
  page: number;
  limit: number;
  sort?:
    | 'datavencimento'
    | 'valorvencimento'
    | 'totalpago'
    | 'capitalaberto'
    | 'createdAt';
  order?: 'ASC' | 'DESC';
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export const PARCELA_REPOSITORY = Symbol('PARCELA_REPOSITORY');

export interface IParcelaRepository {
  list(
    filter: ListParcelasFilter,
    pagination: Pagination,
  ): Promise<Paginated<Parcela>>;
}
