import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsDateString,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ListContratosQueryDto {
  @ApiPropertyOptional({
    description: 'Filtro por parte do identificador do contrato',
  })
  @IsOptional()
  @IsString()
  contratoLike?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date',
    description: 'YYYY-MM-DD',
  })
  @IsOptional()
  @IsDateString()
  dataFrom?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date',
    description: 'YYYY-MM-DD',
  })
  @IsOptional()
  @IsDateString()
  dataTo?: string;

  @ApiPropertyOptional({
    description: 'Número em string. Use ponto como separador decimal.',
  })
  @IsOptional()
  @IsNumberString()
  minValorTotal?: string;

  @ApiPropertyOptional({
    description: 'Número em string. Use ponto como separador decimal.',
  })
  @IsOptional()
  @IsNumberString()
  maxValorTotal?: string;

  @ApiPropertyOptional({
    enum: ['true', 'false'],
    description: 'String booleana',
  })
  @IsOptional()
  @IsBooleanString()
  hasEntrada?: string;

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
    enum: ['data', 'contrato', 'valortotal', 'valorentrada', 'valorfinanciado'],
  })
  @IsOptional()
  @IsString()
  sort?:
    | 'data'
    | 'contrato'
    | 'valortotal'
    | 'valorentrada'
    | 'valorfinanciado';

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';
}
