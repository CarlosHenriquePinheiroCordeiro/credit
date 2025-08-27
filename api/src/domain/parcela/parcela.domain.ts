export class Parcela {
  constructor(
    public readonly contratoId: string,
    public readonly datavencimento: Date,
    public readonly valorvencimento: number,
    public readonly dataultimopagamento: Date | null,
    public readonly totalpago: number,
    public readonly capitalaberto: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
