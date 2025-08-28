/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-argument */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { MaximoAbertoController } from '../../../src/web/maximo-aberto/maximo-aberto.controller';
import { MaximoAbertoFromStreamUseCase } from '../../../src/application/maximo-aberto/maximo-aberto-from-stream.usecase';
import {
  ParcelaStreamGateway,
  ParcelaStreamItem,
} from '../../../src/domain/maximo-aberto/parcela.stream.gateway';
import { MaximoAbertoModule } from '../../../src/web/maximo-aberto/maximo-aberto.module';

class FakeStreamGateway implements ParcelaStreamGateway {
  async *iterateFromJsonStream(
    input: NodeJS.ReadableStream,
  ): AsyncIterable<ParcelaStreamItem> {
    const raw = await streamToString(input);
    const data = JSON.parse(raw);
    const items: ParcelaStreamItem[] = Array.isArray(data)
      ? data
      : Array.isArray(data.items)
        ? data.items
        : [];
    for (const it of items) yield it;
  }
}

function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (c) =>
      chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)),
    );
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    stream.on('error', reject);
  });
}

function writeTempJSON(basename: string, content: unknown): string {
  const dir = path.join(process.cwd(), 'tmp-tests');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, basename);
  fs.writeFileSync(file, JSON.stringify(content), 'utf8');
  return file;
}

describe('E2E: /maximo-aberto (upload JSON)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MaximoAbertoController],
      providers: [
        {
          provide: MaximoAbertoFromStreamUseCase,
          useFactory: () =>
            new MaximoAbertoFromStreamUseCase(new FakeStreamGateway()),
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('400 quando nenhum arquivo é enviado', async () => {
    await request(app.getHttpServer()).post('/maximo-aberto').expect(400);
  });

  it('200 com JSON normal (pico de aberto em 02/2025)', async () => {
    const items: ParcelaStreamItem[] = [
      { valorvencimento: 100, datavencimento: '2025-01-10', totalpago: 0 },
      { valorvencimento: 50, datavencimento: '2025-02-05', totalpago: 25 },
      { valorvencimento: 10, datavencimento: '2025-03-01', totalpago: 200 },
    ];
    const jsonPath = writeTempJSON('parcelas.json', items);

    const res = await request(app.getHttpServer())
      .post('/maximo-aberto')
      .attach('file', jsonPath)
      .expect(200);
    expect(res.body).toEqual({ mes: '02/2025', total_aberto: 125 });
  });

  it('prova real do enunciado: pico em 04/2020 com total_aberto = 900', async () => {
    const items = [
      { valorvencimento: 500, datavencimento: '2020-01-10', totalpago: 0 },
      { valorvencimento: 0, datavencimento: '2020-02-10', totalpago: 100 },
      { valorvencimento: 0, datavencimento: '2020-03-10', totalpago: 100 },
      { valorvencimento: 600, datavencimento: '2020-04-10', totalpago: 0 },
      { valorvencimento: 0, datavencimento: '2020-05-10', totalpago: 200 },
    ];

    const jsonPath = writeTempJSON('prova-enunciado.json', items);

    const res = await request(app.getHttpServer())
      .post('/maximo-aberto')
      .attach('file', jsonPath)
      .expect(200);

    expect(res.body).toEqual({ mes: '04/2020', total_aberto: 900 });
  });

  describe('E2E: /maximo-aberto com gateway REAL (arquivo da infra)', () => {
    let appReal: INestApplication;

    beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [MaximoAbertoModule],
      }).compile();

      appReal = moduleRef.createNestApplication();
      await appReal.init();
    });

    afterAll(async () => {
      await appReal.close();
    });

    it('200 com JSON utilizado na infra (historico.json)', async () => {
      const historicoPath = path.resolve(
        __dirname,
        '../../../src/infra/db/seed/historico.json',
      );

      const res = await request(appReal.getHttpServer())
        .post('/maximo-aberto')
        .attach('file', historicoPath)
        .expect(200);

      expect(res.body).toHaveProperty('mes');
      expect(res.body).toHaveProperty('total_aberto');
      expect(res.body).toEqual({ mes: '04/2023', total_aberto: 2545.14 });
    });
  });

  it('200 com JSON vazio → 01/1970 e 0', async () => {
    const jsonPath = writeTempJSON('parcelas-vazio.json', []);
    const res = await request(app.getHttpServer())
      .post('/maximo-aberto')
      .attach('file', jsonPath)
      .expect(200);

    expect(res.body).toEqual({ mes: '01/1970', total_aberto: 0 });
  });
});
