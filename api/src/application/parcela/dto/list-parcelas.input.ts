import {
  ListParcelasFilter,
  Pagination,
} from 'src/domain/parcela/parcela.repository';

export type ListParcelasInput = Partial<ListParcelasFilter & Pagination> & {
  contratoId: string;
};
