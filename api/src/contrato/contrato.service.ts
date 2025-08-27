import { Injectable } from '@nestjs/common';

@Injectable()
export class ContratoService {
  constructor() {}

  async find(page: number, limit: number): Promise<any> {
    /*const resp = await this.prisma.contrato.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { data: 'desc' },
      select: {
        contrato: true,
        data: true,
        valortotal: true,
        valorentrada: true,
        valorfinanciado: true,
      },
    });
    return resp;*/
  }
}
