import { Contrato } from '../../../domain/contrato/contrato.domain';

export interface ListContratosOutput {
  items: Contrato[];
  total: number;
  page: number;
  limit: number;
}
