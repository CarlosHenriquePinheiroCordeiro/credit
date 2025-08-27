/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import 'reflect-metadata';
import * as fs from 'node:fs';
import * as path from 'node:path';
import dataSource from '../src/infra/db/typeorm/data-source';
import { Contrato } from '../src/infra/db/typeorm/entities/contrato.entity';
import { Parcela } from '../src/infra/db/typeorm/entities/parcela.entity';

type ParcelaJSON = {
  valorvencimento: number;
  datavencimento: string;
  dataultimopagamento?: string | null;
  totalpago: number;
  capitalaberto: number;
};

type ContratoJSON = {
  contrato: string;
  data: string;
  valortotal: number;
  valorentrada: number;
  valorfinanciado: number;
  parcelas: ParcelaJSON[];
};

type RootJSON = { contratos: ContratoJSON[] };

const toDate = (d?: string | null) => (d ? new Date(d + 'T00:00:00Z') : null);
const toNum = (v: number | string) => (typeof v === 'number' ? v : Number(v));

async function main() {
  const defaultPath = path.join(
    process.cwd(),
    'src/infra/db/seed',
    'historico.json',
  );
  const file = process.env.SEED_FILE || defaultPath;

  console.log(`[seed] lendo: ${file}`);
  if (!fs.existsSync(file)) throw new Error(`arquivo não encontrado: ${file}`);

  const json: RootJSON = JSON.parse(fs.readFileSync(file, 'utf-8'));
  console.log(`[seed] contratos no JSON: ${json.contratos?.length ?? 0}`);

  await dataSource.initialize();
  const contratoRepo = dataSource.getRepository(Contrato);
  const parcelaRepo = dataSource.getRepository(Parcela);

  for (const c of json.contratos) {
    await contratoRepo.upsert(
      {
        contrato: c.contrato,
        data: toDate(c.data)!,
        valortotal: c.valortotal,
        valorentrada: c.valorentrada,
        valorfinanciado: c.valorfinanciado,
      },
      ['contrato'],
    );

    const saved = await contratoRepo.findOneByOrFail({ contrato: c.contrato });

    if (c.parcelas?.length) {
      const rows = c.parcelas.map((p) => ({
        contratoId: saved.contrato,
        valorvencimento: toNum(p.valorvencimento),
        datavencimento: toDate(p.datavencimento)!,
        dataultimopagamento: toDate(p.dataultimopagamento ?? null),
        totalpago: toNum(p.totalpago),
        capitalaberto: toNum(p.capitalaberto),
      }));

      await parcelaRepo
        .createQueryBuilder()
        .insert()
        .values(rows)
        .orIgnore()
        .execute();

      console.log(
        `[seed] contrato ${c.contrato}: ${rows.length} parcelas inseridas/ignoradas`,
      );
    }
  }

  await dataSource.destroy();
  console.log('[seed] concluído ✅');
}

main().catch(async (e) => {
  console.error('[seed] erro:', e);
  process.exit(1);
});
