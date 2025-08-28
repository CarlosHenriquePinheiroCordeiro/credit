import { Inject, Injectable } from '@nestjs/common';
import { CONTRATO_REPOSITORY } from '../../domain/contrato/contrato.repository';
import { ListContratosOutput } from './dto/list-contratos.output';
import { ListContratosInput } from './dto/list-contratos.input';
import type { IContratoRepository } from '../../domain/contrato/contrato.repository';

@Injectable()
export class ListContratosUseCase {
  constructor(
    @Inject(CONTRATO_REPOSITORY)
    private readonly repo: IContratoRepository,
  ) {}

  async execute(input: ListContratosInput = {}): Promise<ListContratosOutput> {
    const page = Math.max(1, input.page ?? 1);
    const limit = Math.min(100, Math.max(1, input.limit ?? 20));
    const sort = input.sort ?? 'data';
    const order = input.order ?? 'DESC';

    const { items, total } = await this.repo.list(
      {
        contratoLike: input.contratoLike,
        dataFrom: input.dataFrom,
        dataTo: input.dataTo,
        minValorTotal: input.minValorTotal,
        maxValorTotal: input.maxValorTotal,
        hasEntrada: input.hasEntrada,
      },
      { page, limit, sort, order },
    );

    return { items, total, page, limit };
  }
}
