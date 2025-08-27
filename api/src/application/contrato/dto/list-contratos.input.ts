import {
  ListContratosFilter,
  Pagination,
} from 'src/domain/contrato/contrato.repository';

export type ListContratosInput = Partial<ListContratosFilter & Pagination>;
