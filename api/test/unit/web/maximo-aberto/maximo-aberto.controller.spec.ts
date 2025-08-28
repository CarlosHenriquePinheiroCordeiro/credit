/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { Readable, PassThrough } from 'node:stream';
import * as fs from 'node:fs';
import { MaximoAbertoController } from '../../../../src/web/maximo-aberto/maximo-aberto.controller';
import { MaximoAbertoFromStreamUseCase } from '../../../../src/application/maximo-aberto/maximo-aberto-from-stream.usecase';

jest.mock('node:fs', () => {
  const actual = jest.requireActual('node:fs');
  return {
    ...actual,
    createReadStream: jest.fn(() => Readable.from([])),
    unlink: jest.fn((_, cb) => cb?.(null)),
  };
});
jest.mock('node:zlib', () => {
  const actual = jest.requireActual('node:zlib');
  return { ...actual, createGunzip: jest.fn(() => new PassThrough()) };
});

describe('MaximoAbertoController', () => {
  let controller: MaximoAbertoController;
  const useCase = { execute: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [MaximoAbertoController],
      providers: [
        { provide: MaximoAbertoFromStreamUseCase, useValue: useCase },
      ],
    }).compile();

    controller = moduleRef.get(MaximoAbertoController);
  });

  it('sem arquivo → BadRequestException', async () => {
    await expect(controller.upload(undefined as any)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('arquivo normal → chama use case com stream e retorna apresentado', async () => {
    useCase.execute.mockResolvedValueOnce({
      mes: '2025-01',
      total_aberto: 999.9,
    });
    const res = await controller.upload({
      fieldname: 'file',
      originalname: 'dados.json',
      path: '/tmp/mock.json',
    } as any);

    expect(fs.createReadStream).toHaveBeenCalledWith('/tmp/mock.json');
    expect(useCase.execute).toHaveBeenCalledTimes(1);
    expect(res).toEqual({ mes: '2025-01', total_aberto: 999.9 });
    expect(fs.unlink).toHaveBeenCalledWith(
      '/tmp/mock.json',
      expect.any(Function),
    );
  });
});
