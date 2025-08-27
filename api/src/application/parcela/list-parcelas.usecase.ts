import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PARCELA_REPOSITORY } from '../../domain/parcela/parcela.repository';
import type { IParcelaRepository } from 'src/domain/parcela/parcela.repository';
import { ListParcelasInput } from './dto/list-parcelas.input';
import { ListParcelasOutput } from './dto/list-parcelas.output';

@Injectable()
export class ListParcelasUseCase {
  constructor(
    @Inject(PARCELA_REPOSITORY)
    private readonly repo: IParcelaRepository,
  ) {}

  async execute(input: ListParcelasInput): Promise<ListParcelasOutput> {
    if (!input.contratoId) {
      throw new BadRequestException('contratoId é obrigatório');
    }

    const page = Math.max(1, input.page ?? 1);
    const limit = Math.min(100, Math.max(1, input.limit ?? 20));
    const sort = input.sort ?? 'datavencimento';
    const order = input.order ?? 'ASC';

    const { items, total } = await this.repo.list(
      {
        contratoId: input.contratoId,
        vencFrom: input.vencFrom,
        vencTo: input.vencTo,
        hasPayment: input.hasPayment,
        hasOpenCapital: input.hasOpenCapital,
      },
      { page, limit, sort, order },
    );

    return { items, total, page, limit };
  }
}
