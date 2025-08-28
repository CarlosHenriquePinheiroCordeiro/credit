/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test } from '@nestjs/testing';
import { ContratoController } from '../../../../src/web/contrato/contrato.controller';
import { ListContratosUseCase } from '../../../../src/application/contrato/list-contratos.usecase';
import { GetEndividamentoTotalUseCase } from '../../../../src/application/contrato/get-endividamento-total.usecase';

describe('ContratoController', () => {
  let controller: ContratoController;
  const listUC = { execute: jest.fn() };
  const totalUC = { execute: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [ContratoController],
      providers: [
        { provide: ListContratosUseCase, useValue: listUC },
        { provide: GetEndividamentoTotalUseCase, useValue: totalUC },
      ],
    }).compile();

    controller = moduleRef.get(ContratoController);
  });

  it('GET /contratos → repassa query mapeada e apresenta itens', async () => {
    const now = new Date('2025-01-02T03:04:05.000Z');
    const outItems = [
      {
        contrato: 'C1',
        data: new Date('2025-01-01T00:00:00.000Z'),
        valortotal: 100,
        valorentrada: 10,
        valorfinanciado: 90,
        createdAt: now,
        updatedAt: now,
        qtdParcelas: 12,
        totalPago: 15,
      },
    ];

    listUC.execute.mockResolvedValueOnce({
      items: outItems,
      total: 1,
      page: 2,
      limit: 10,
    });

    const res = await controller.list({
      contratoLike: 'ABC',
      dataFrom: '2025-01-01',
      dataTo: '2025-12-31',
      minValorTotal: '100',
      maxValorTotal: '200',
      hasEntrada: 'true',
      page: 2,
      limit: 10,
      sort: 'data',
      order: 'ASC',
    } as any);

    expect(listUC.execute).toHaveBeenCalledWith({
      contratoLike: 'ABC',
      dataFrom: new Date('2025-01-01'),
      dataTo: new Date('2025-12-31'),
      minValorTotal: 100,
      maxValorTotal: 200,
      hasEntrada: true,
      page: 2,
      limit: 10,
      sort: 'data',
      order: 'ASC',
    });

    expect(res).toEqual({
      items: [
        {
          contrato: 'C1',
          data: '2025-01-01',
          valortotal: 100,
          valorentrada: 10,
          valorfinanciado: 90,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          qtdParcelas: 12,
          totalPago: 15,
        },
      ],
      total: 1,
      page: 2,
      limit: 10,
    });
  });

  it('GET /contratos/endividamento-total → apresenta resposta', async () => {
    totalUC.execute.mockResolvedValueOnce({ endividamento_total: 123.45 });
    const res = await controller.endividamentoTotal();
    expect(totalUC.execute).toHaveBeenCalledTimes(1);
    expect(res).toEqual({ endividamento_total: 123.45 });
  });
});
