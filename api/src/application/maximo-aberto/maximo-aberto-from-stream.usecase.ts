import { ParcelaStreamGateway } from '../../domain/maximo-aberto/parcela.stream.gateway';

export type MaximoAbertoViewModel = { mes: string; total_aberto: number };

type MonthlyBucket = { amount: number; paid: number };

export class MaximoAbertoFromStreamUseCase {
  constructor(private readonly gateway: ParcelaStreamGateway) {}

  async execute(input: NodeJS.ReadableStream): Promise<MaximoAbertoViewModel> {
    const monthly = await this.aggregateByMonth(input);

    if (monthly.size === 0) {
      return { mes: '01/1970', total_aberto: 0 };
    }

    const { month: peakMonth, open: peakOpen } = this.findPeakOpen(monthly);

    return {
      mes: MaximoAbertoFromStreamUseCase.toBrMonth(peakMonth),
      total_aberto: MaximoAbertoFromStreamUseCase.round2(Math.max(0, peakOpen)),
    };
  }

  private async aggregateByMonth(
    input: NodeJS.ReadableStream,
  ): Promise<Map<string, MonthlyBucket>> {
    const monthly = new Map<string, MonthlyBucket>();

    for await (const parcela of this.gateway.iterateFromJsonStream(input)) {
      const monthKey = MaximoAbertoFromStreamUseCase.toMonthKey(
        parcela.datavencimento,
      );
      const bucket = monthly.get(monthKey) ?? { amount: 0, paid: 0 };

      bucket.amount += Number(parcela.valorvencimento) || 0;
      bucket.paid += Number(parcela.totalpago) || 0;

      monthly.set(monthKey, bucket);
    }

    return monthly;
  }

  private findPeakOpen(monthly: Map<string, MonthlyBucket>): {
    month: string;
    open: number;
  } {
    const months = [...monthly.keys()].sort();

    let cumulativeAmount = 0;
    let cumulativePaid = 0;
    let maxOpen = Number.NEGATIVE_INFINITY;
    let maxMonth = months[0];

    for (const month of months) {
      const { amount, paid } = monthly.get(month)!;
      cumulativeAmount += amount;
      cumulativePaid += paid;

      const open = MaximoAbertoFromStreamUseCase.round2(
        cumulativeAmount - cumulativePaid,
      );
      if (open > maxOpen) {
        maxOpen = open;
        maxMonth = month;
      }
    }

    return { month: maxMonth, open: maxOpen };
  }

  private static toMonthKey(isoDate: string): string {
    const d = new Date(isoDate);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }

  private static toBrMonth(key: string): string {
    const [y, m] = key.split('-');
    return `${m}/${y}`;
  }

  private static round2(n: number): number {
    return Math.round(n * 100) / 100;
  }
}
