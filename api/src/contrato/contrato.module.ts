import { Module } from '@nestjs/common';
import { ContratoService } from './contrato.service';
import { ContratoController } from './contrato.controller';

@Module({
  imports: [],
  controllers: [ContratoController],
  providers: [ContratoService],
})
export class ContratoModule {}
