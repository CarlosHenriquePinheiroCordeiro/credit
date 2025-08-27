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
  @IsString()
  contratoId!: string;

  @IsOptional()
  @IsDateString()
  vencFrom?: string;

  @IsOptional()
  @IsDateString()
  vencTo?: string;

  @IsOptional()
  @IsBooleanString()
  hasPayment?: string;

  @IsOptional()
  @IsBooleanString()
  hasOpenCapital?: string;

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
    | 'datavencimento'
    | 'valorvencimento'
    | 'totalpago'
    | 'capitalaberto'
    | 'createdAt';

  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';
}
