import { Contrato } from 'src/domain/contrato/contrato.domain';

export type ContratoHttp = {
  contrato: string;
  data: string;
  valortotal: number;
  valorentrada: number;
  valorfinanciado: number;
  createdAt: string;
  updatedAt: string;
};

export function presentContrato(c: Contrato): ContratoHttp {
  return {
    contrato: c.contrato,
    data: c.data.toISOString().slice(0, 10),
    valortotal: c.valortotal,
    valorentrada: c.valorentrada,
    valorfinanciado: c.valorfinanciado,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}
