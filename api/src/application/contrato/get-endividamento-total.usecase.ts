// src/application/contrato/get-endividamento-total.usecase.ts
import { Inject, Injectable } from '@nestjs/common';
import { PARCELA_REPOSITORY } from '../../domain/parcela/parcela.repository';
import type { IParcelaRepository } from '../../domain/parcela/parcela.repository';

export type EndividamentoTotalViewModel = { endividamento_total: number };

@Injectable()
export class GetEndividamentoTotalUseCase {
  constructor(
    @Inject(PARCELA_REPOSITORY)
    private readonly parcelaRepo: IParcelaRepository,
  ) {}

  async execute(): Promise<EndividamentoTotalViewModel> {
    const total = await this.parcelaRepo.sumCapitalAberto();
    return { endividamento_total: Math.round(total * 100) / 100 };
  }
}
