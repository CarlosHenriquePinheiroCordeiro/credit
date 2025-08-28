import { Module } from '@nestjs/common';
import { MaximoAbertoController } from './maximo-aberto.controller';
import { StreamJsonParcelaGateway } from 'src/infra/gateways/stream-json-parcela.gateway';
import { MaximoAbertoFromStreamUseCase } from 'src/application/maximo-aberto/maximo-aberto-from-stream.usecase';

@Module({
  controllers: [MaximoAbertoController],
  providers: [
    StreamJsonParcelaGateway,
    {
      provide: MaximoAbertoFromStreamUseCase,
      useFactory: (gateway: StreamJsonParcelaGateway) =>
        new MaximoAbertoFromStreamUseCase(gateway),
      inject: [StreamJsonParcelaGateway],
    },
  ],
})
export class MaximoAbertoModule {}
