// src/web/contratos/contrato.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ListContratosUseCase } from '../../application/contrato/list-contratos.usecase';
import { ListContratosQueryDto } from './contrato.dto';
import {
  presentContrato,
  presentEndividamentoTotal,
  EndividamentoTotalResponseDto,
} from './contrato.presenter';
import { GetEndividamentoTotalUseCase } from '../../application/contrato/get-endividamento-total.usecase';

@Controller('contratos')
export class ContratoController {
  constructor(
    private readonly listContratos: ListContratosUseCase,
    private readonly getEndividamentoTotal: GetEndividamentoTotalUseCase,
  ) {}

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

  @Get('endividamento-total')
  async endividamentoTotal(): Promise<EndividamentoTotalResponseDto> {
    const result = await this.getEndividamentoTotal.execute();
    return presentEndividamentoTotal(result);
  }
}
