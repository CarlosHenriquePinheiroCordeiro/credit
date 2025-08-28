import { ApiProperty } from '@nestjs/swagger';

export class ParcelaHttpDto {
  @ApiProperty() contratoId!: string;
  @ApiProperty({ format: 'date' }) datavencimento!: string;
  @ApiProperty() valorvencimento!: number;
  @ApiProperty({ format: 'date', nullable: true }) dataultimopagamento!:
    | string
    | null;
  @ApiProperty() totalpago!: number;
  @ApiProperty() capitalaberto!: number;
  @ApiProperty({ format: 'date-time' }) createdAt!: string;
  @ApiProperty({ format: 'date-time' }) updatedAt!: string;
}

export class PaginatedParcelasDto {
  @ApiProperty({ type: [ParcelaHttpDto] }) items!: ParcelaHttpDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
}
