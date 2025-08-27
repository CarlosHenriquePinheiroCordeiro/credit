export class Contrato {
  constructor(
    public readonly contrato: string,
    public readonly data: Date,
    public readonly valortotal: number,
    public readonly valorentrada: number,
    public readonly valorfinanciado: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly qtdParcelas?: number,
    public readonly totalPago?: number,
  ) {}
}
