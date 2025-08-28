/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { presentParcela } from '../../../../src/web/parcela/parcela.presenter';

describe('presentParcela', () => {
  it('formata datavencimento e dataultimopagamento', () => {
    const now = new Date('2025-01-02T03:04:05.000Z');
    const out = presentParcela({
      contratoId: 'C1',
      datavencimento: new Date('2025-01-10T00:00:00.000Z'),
      valorvencimento: 100,
      dataultimopagamento: new Date('2025-01-15T00:00:00.000Z'),
      totalpago: 50,
      capitalaberto: 50,
      createdAt: now,
      updatedAt: now,
    } as any);

    expect(out.datavencimento).toBe('2025-01-10');
    expect(out.dataultimopagamento).toBe('2025-01-15');
    expect(out.createdAt).toBe(now.toISOString());
    expect(out.updatedAt).toBe(now.toISOString());
  });

  it('dataultimopagamento null permanece null', () => {
    const now = new Date('2025-01-02T03:04:05.000Z');
    const out = presentParcela({
      contratoId: 'C1',
      datavencimento: new Date('2025-01-10T00:00:00.000Z'),
      valorvencimento: 100,
      dataultimopagamento: null,
      totalpago: 0,
      capitalaberto: 100,
      createdAt: now,
      updatedAt: now,
    } as any);

    expect(out.dataultimopagamento).toBeNull();
  });
});
