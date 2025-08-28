/* eslint-disable @typescript-eslint/only-throw-error */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, BadRequestException } from '@nestjs/common';
import {
  ParcelaStreamGateway,
  ParcelaStreamItem,
} from '../../domain/maximo-aberto/parcela.stream.gateway';
import { parser } from 'stream-json';
import { pick } from 'stream-json/filters/Pick';
import { streamArray } from 'stream-json/streamers/StreamArray';

type Contrato = { parcelas?: unknown[] };
type StreamArrayChunk<T> = { key: number; value: T };

@Injectable()
export class StreamJsonParcelaGateway implements ParcelaStreamGateway {
  async *iterateFromJsonStream(
    input: NodeJS.ReadableStream,
  ): AsyncIterable<ParcelaStreamItem> {
    const pipeline = input
      .pipe(parser())
      .pipe(pick({ filter: 'contratos' }))
      .pipe(streamArray());

    let finished = false;
    let thrown: unknown;
    const queue: ParcelaStreamItem[] = [];

    const isParcela = (v: unknown): v is ParcelaStreamItem =>
      !!v &&
      typeof v === 'object' &&
      typeof (v as any).datavencimento === 'string' &&
      (typeof (v as any).valorvencimento === 'number' ||
        typeof (v as any).valorvencimento === 'string');

    const pushParcela = (raw: unknown) => {
      if (!isParcela(raw)) {
        thrown = new BadRequestException('Parcela inválida no JSON');
        pipeline.destroy(thrown as Error);
        return;
      }
      queue.push({
        datavencimento: String((raw as any).datavencimento),
        valorvencimento: Number((raw as any).valorvencimento) || 0,
        totalpago: (raw as any).totalpago ? Number((raw as any).totalpago) : 0,
      });
    };

    pipeline.on('data', ({ value }: StreamArrayChunk<Contrato>) => {
      const parcelas = value?.parcelas;
      if (!Array.isArray(parcelas)) return;
      for (const p of parcelas) pushParcela(p);
    });

    pipeline.on('end', () => {
      finished = true;
    });

    pipeline.on('error', (e) => {
      thrown = e;
      finished = true;
    });

    while (!finished || queue.length) {
      if (thrown) throw thrown;
      const next = queue.shift();
      if (next) {
        yield next;
      } else {
        await new Promise((r) => setImmediate(r));
      }
    }

    if (thrown) throw thrown;
  }
}
