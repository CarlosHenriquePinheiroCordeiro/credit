import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ListContratosUseCase } from '../../application/contrato/list-contratos.usecase';
import { ListContratosQueryDto } from './contrato.dto';
import { presentContrato } from './contrato.presenter';
import {
  PaginatedContratosDto,
  ContratoHttpDto,
} from './contrato.presenter.swagger';
import { GetEndividamentoTotalUseCase } from '../../../src/application/contrato/get-endividamento-total.usecase';

@ApiTags('Contratos')
@Controller('contratos')
export class ContratoController {
  constructor(
    private readonly listContratos: ListContratosUseCase,
    private readonly getEndividamentoTotal: GetEndividamentoTotalUseCase,
  ) {}

  @Get()
  @ApiOkResponse({ type: PaginatedContratosDto })
  async list(
    @Query() queryParams: ListContratosQueryDto,
  ): Promise<PaginatedContratosDto> {
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
      items: output.items.map(presentContrato) as unknown as ContratoHttpDto[],
      total: output.total,
      page: output.page,
      limit: output.limit,
    };
  }

  @Get('endividamento-total')
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: { endividamento_total: { type: 'number', example: 2545.14 } },
      required: ['endividamento_total'],
    },
  })
  async endividamentoTotal(): Promise<{ endividamento_total: number }> {
    const result = await this.getEndividamentoTotal.execute();
    return result;
  }
}
