import { ApiProperty } from '@nestjs/swagger';

export class MaximoAbertoResponseDtoSwagger {
  @ApiProperty({ example: '04/2023', description: 'MM/YYYY' })
  mes!: string;

  @ApiProperty({ example: 2545.14 })
  total_aberto!: number;
}
