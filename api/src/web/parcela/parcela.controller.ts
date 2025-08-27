/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Query } from '@nestjs/common';
import { ListParcelasQueryDto } from './parcela.dto';
import { ListParcelasUseCase } from '../../application/parcela/list-parcelas.usecase';
import { presentParcela } from './parcela.presenter';

@Controller('parcelas')
export class ParcelasController {
  constructor(private readonly listParcelas: ListParcelasUseCase) {}

  @Get()
  async list(@Query() q: ListParcelasQueryDto) {
    const output = await this.listParcelas.execute({
      contratoId: q.contratoId,
      vencFrom: q.vencFrom ? new Date(q.vencFrom) : undefined,
      vencTo: q.vencTo ? new Date(q.vencTo) : undefined,
      hasPayment:
        q.hasPayment === undefined ? undefined : q.hasPayment === 'true',
      hasOpenCapital:
        q.hasOpenCapital === undefined
          ? undefined
          : q.hasOpenCapital === 'true',
      page: q.page,
      limit: q.limit,
      sort: q.sort,
      order: q.order,
    });

    return {
      items: output.items.map(presentParcela),
      total: output.total,
      page: output.page,
      limit: output.limit,
    };
  }
}
