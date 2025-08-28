/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test } from '@nestjs/testing';
import { ListParcelasUseCase } from '../../../../src/application/parcela/list-parcelas.usecase';
import { ParcelasController } from '../../../../src/web/parcela/parcela.controller';

describe('ParcelasController', () => {
  let controller: ParcelasController;
  const listUC = { execute: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [ParcelasController],
      providers: [{ provide: ListParcelasUseCase, useValue: listUC }],
    }).compile();

    controller = moduleRef.get(ParcelasController);
  });

  it('GET /parcelas → filtra por contratoId e apresenta itens', async () => {
    const now = new Date('2025-01-02T03:04:05.000Z');
    const p = {
      contratoId: 'C-1',
      datavencimento: new Date('2025-01-10T00:00:00.000Z'),
      valorvencimento: 100,
      dataultimopagamento: new Date('2025-01-15T00:00:00.000Z'),
      totalpago: 50,
      capitalaberto: 50,
      createdAt: now,
      updatedAt: now,
    };

    listUC.execute.mockResolvedValueOnce({
      items: [p],
      total: 1,
      page: 1,
      limit: 20,
    });

    const res = await controller.list({
      contratoId: 'C-1',
      vencFrom: '2025-01-01',
      vencTo: '2025-12-31',
      hasPayment: 'true',
      hasOpenCapital: 'false',
      page: 1,
      limit: 20,
      sort: 'datavencimento',
      order: 'ASC',
    } as any);

    expect(listUC.execute).toHaveBeenCalledWith({
      contratoId: 'C-1',
      vencFrom: new Date('2025-01-01'),
      vencTo: new Date('2025-12-31'),
      hasPayment: true,
      hasOpenCapital: false,
      page: 1,
      limit: 20,
      sort: 'datavencimento',
      order: 'ASC',
    });

    expect(res).toEqual({
      items: [
        {
          contratoId: 'C-1',
          datavencimento: '2025-01-10',
          valorvencimento: 100,
          dataultimopagamento: '2025-01-15',
          totalpago: 50,
          capitalaberto: 50,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      ],
      total: 1,
      page: 1,
      limit: 20,
    });
  });
});
