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
  @IsOptional()
  @IsString()
  contratoLike?: string;

  @IsOptional()
  @IsDateString()
  dataFrom?: string;

  @IsOptional()
  @IsDateString()
  dataTo?: string;

  @IsOptional()
  @IsNumberString()
  minValorTotal?: string;

  @IsOptional()
  @IsNumberString()
  maxValorTotal?: string;

  @IsOptional()
  @IsBooleanString()
  hasEntrada?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  sort?:
    | 'data'
    | 'contrato'
    | 'valortotal'
    | 'valorentrada'
    | 'valorfinanciado';

  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';
}
