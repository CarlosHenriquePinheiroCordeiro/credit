import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ListParcelasQueryDto {
  @ApiProperty({ description: 'Identificador do contrato (obrigatório)' })
  @IsString()
  contratoId!: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date',
    description: 'YYYY-MM-DD',
  })
  @IsOptional()
  @IsDateString()
  vencFrom?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date',
    description: 'YYYY-MM-DD',
  })
  @IsOptional()
  @IsDateString()
  vencTo?: string;

  @ApiPropertyOptional({
    enum: ['true', 'false'],
    description: 'String booleana',
  })
  @IsOptional()
  @IsBooleanString()
  hasPayment?: string;

  @ApiPropertyOptional({
    enum: ['true', 'false'],
    description: 'String booleana',
  })
  @IsOptional()
  @IsBooleanString()
  hasOpenCapital?: string;

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ minimum: 1, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    enum: [
      'datavencimento',
      'valorvencimento',
      'totalpago',
      'capitalaberto',
      'createdAt',
    ],
  })
  @IsOptional()
  @IsString()
  sort?:
    | 'datavencimento'
    | 'valorvencimento'
    | 'totalpago'
    | 'capitalaberto'
    | 'createdAt';

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';
}
