import { Parcela } from 'src/domain/parcela/parcela.domain';

export type ParcelaHttp = {
  contratoId: string;
  datavencimento: string;
  valorvencimento: number;
  dataultimopagamento: string | null;
  totalpago: number;
  capitalaberto: number;
  createdAt: string;
  updatedAt: string;
};

export function presentParcela(p: Parcela): ParcelaHttp {
  return {
    contratoId: p.contratoId,
    datavencimento: p.datavencimento.toISOString().slice(0, 10),
    valorvencimento: p.valorvencimento,
    dataultimopagamento: p.dataultimopagamento
      ? p.dataultimopagamento.toISOString().slice(0, 10)
      : null,
    totalpago: p.totalpago,
    capitalaberto: p.capitalaberto,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}
