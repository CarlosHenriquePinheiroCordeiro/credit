/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { presentContrato } from '../../../../src/web/contrato/contrato.presenter';

describe('presentContrato', () => {
  it('formata datas e mantém números', () => {
    const now = new Date('2025-01-02T03:04:05.000Z');
    const out = presentContrato({
      contrato: 'C1',
      data: new Date('2025-01-01T00:00:00.000Z'),
      valortotal: 100,
      valorentrada: 10,
      valorfinanciado: 90,
      createdAt: now,
      updatedAt: now,
      qtdParcelas: 12,
      totalPago: 15,
    } as any);

    expect(out).toEqual({
      contrato: 'C1',
      data: '2025-01-01',
      valortotal: 100,
      valorentrada: 10,
      valorfinanciado: 90,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      qtdParcelas: 12,
      totalPago: 15,
    });
  });
});
