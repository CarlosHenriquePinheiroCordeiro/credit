import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ListParcelasQueryDto } from './parcela.dto';
import { ListParcelasUseCase } from '../../application/parcela/list-parcelas.usecase';
import { presentParcela } from './parcela.presenter';
import {
  PaginatedParcelasDto,
  ParcelaHttpDto,
} from './parcela.presenter.swagger';

@ApiTags('Parcelas')
@Controller('parcelas')
export class ParcelasController {
  constructor(private readonly listParcelas: ListParcelasUseCase) {}

  @Get()
  @ApiOkResponse({ type: PaginatedParcelasDto })
  async list(@Query() q: ListParcelasQueryDto): Promise<PaginatedParcelasDto> {
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
      items: output.items.map(presentParcela) as unknown as ParcelaHttpDto[],
      total: output.total,
      page: output.page,
      limit: output.limit,
    };
  }
}
