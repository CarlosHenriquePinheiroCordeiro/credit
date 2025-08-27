import { Controller, Get, Param } from '@nestjs/common';
import { ContratoService } from './contrato.service';

@Controller('contrato')
export class ContratoController {
  constructor(private readonly contratoService: ContratoService) {}

  @Get()
  async find(
    @Param('page') page: number,
    @Param('limit') limit: number,
  ): Promise<any[]> {
    const contracts = await this.contratoService.find(page, limit);
    return contracts;
  }
}
