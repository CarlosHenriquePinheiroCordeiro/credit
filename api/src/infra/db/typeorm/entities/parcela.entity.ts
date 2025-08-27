import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Contrato } from './contrato.entity';

@Entity('parcelas')
@Unique(['contratoId', 'datavencimento'])
export class Parcela {
  @PrimaryColumn({ name: 'contratoId', type: 'varchar', length: 100 })
  contratoId!: string;

  @PrimaryColumn({ name: 'datavencimento', type: 'date' })
  datavencimento!: Date;

  @ManyToOne(() => Contrato, (c) => c.parcelas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contratoId', referencedColumnName: 'contrato' })
  contrato!: Contrato;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  valorvencimento!: number;

  @Column({ type: 'date', nullable: true })
  dataultimopagamento!: Date | null;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  totalpago!: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  capitalaberto!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
