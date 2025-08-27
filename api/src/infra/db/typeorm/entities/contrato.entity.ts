import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Parcela } from './parcela.entity';

@Entity('contratos')
@Unique(['contrato'])
export class Contrato {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  contrato!: string;

  @Column({ type: 'date' })
  data!: Date;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  valortotal!: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  valorentrada!: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  valorfinanciado!: number;

  @OneToMany(() => Parcela, (i) => i.contrato)
  parcelas!: Parcela[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  qtdParcelas?: number;

  totalPago?: number;
}
