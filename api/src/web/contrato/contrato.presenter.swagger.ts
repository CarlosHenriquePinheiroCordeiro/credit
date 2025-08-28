import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContratoHttpDto {
  @ApiProperty() contrato!: string;
  @ApiProperty({ format: 'date', example: '2025-04-15' }) data!: string;
  @ApiProperty() valortotal!: number;
  @ApiProperty() valorentrada!: number;
  @ApiProperty() valorfinanciado!: number;
  @ApiProperty({ format: 'date-time' }) createdAt!: string;
  @ApiProperty({ format: 'date-time' }) updatedAt!: string;
  @ApiPropertyOptional() qtdParcelas?: number;
  @ApiPropertyOptional() totalPago?: number;
}

export class PaginatedContratosDto {
  @ApiProperty({ type: [ContratoHttpDto] }) items!: ContratoHttpDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
}
