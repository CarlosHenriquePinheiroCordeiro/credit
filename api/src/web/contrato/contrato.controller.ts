import { Controller, Get, Query } from '@nestjs/common';
import { ListContratosUseCase } from 'src/application/contrato/list-contratos.usecase';
import { ListContratosQueryDto } from './contrato.dto';
import { presentContrato } from './contrato.presenter';

@Controller('contratos')
export class ContratoController {
  constructor(private readonly listContratos: ListContratosUseCase) {}

  @Get()
  async list(@Query() queryParams: ListContratosQueryDto) {
    const output = await this.listContratos.execute({
      contratoLike: queryParams.contratoLike,
      dataFrom: queryParams.dataFrom
        ? new Date(queryParams.dataFrom)
        : undefined,
      dataTo: queryParams.dataTo ? new Date(queryParams.dataTo) : undefined,
      minValorTotal: queryParams.minValorTotal
        ? Number(queryParams.minValorTotal)
        : undefined,
      maxValorTotal: queryParams.maxValorTotal
        ? Number(queryParams.maxValorTotal)
        : undefined,
      hasEntrada:
        queryParams.hasEntrada === undefined
          ? undefined
          : queryParams.hasEntrada === 'true',
      page: queryParams.page,
      limit: queryParams.limit,
      sort: queryParams.sort,
      order: queryParams.order,
    });

    return {
      items: output.items.map(presentContrato),
      total: output.total,
      page: output.page,
      limit: output.limit,
    };
  }
}
