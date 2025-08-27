import { Parcela } from 'src/domain/parcela/parcela.domain';

export interface ListParcelasOutput {
  items: Parcela[];
  total: number;
  page: number;
  limit: number;
}
