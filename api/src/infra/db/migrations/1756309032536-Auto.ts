import { MigrationInterface, QueryRunner } from 'typeorm';

export class Auto1756309032536 implements MigrationInterface {
  name = 'Auto1756309032536';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "contratos" ("contrato" character varying(100) NOT NULL, "data" date NOT NULL, "valortotal" numeric(12,2) NOT NULL, "valorentrada" numeric(12,2) NOT NULL, "valorfinanciado" numeric(12,2) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e516e597e5f1d0fb590a0553e5a" UNIQUE ("contrato"), CONSTRAINT "PK_e516e597e5f1d0fb590a0553e5a" PRIMARY KEY ("contrato"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "parcelas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contratoId" character varying NOT NULL, "valorvencimento" numeric(12,2) NOT NULL, "datavencimento" date NOT NULL, "dataultimopagamento" date, "totalpago" numeric(12,2) NOT NULL, "capitalaberto" numeric(12,2) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "contratoContrato" character varying(100), CONSTRAINT "UQ_8606f99f75b4e1b2709896272bd" UNIQUE ("contratoId", "datavencimento"), CONSTRAINT "PK_2081f431fed935a5bb1da9f420b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcelas" ADD CONSTRAINT "FK_8ab6d3e03949ea6a61851eeb6b9" FOREIGN KEY ("contratoContrato") REFERENCES "contratos"("contrato") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "parcelas" DROP CONSTRAINT "FK_8ab6d3e03949ea6a61851eeb6b9"`,
    );
    await queryRunner.query(`DROP TABLE "parcelas"`);
    await queryRunner.query(`DROP TABLE "contratos"`);
  }
}
