/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Auto1756309412406 implements MigrationInterface {
    name = 'Auto1756309412406';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcelas" DROP CONSTRAINT "FK_8ab6d3e03949ea6a61851eeb6b9"`);
        await queryRunner.query(`ALTER TABLE "parcelas" DROP CONSTRAINT "PK_2081f431fed935a5bb1da9f420b"`);
        await queryRunner.query(`ALTER TABLE "parcelas" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "parcelas" DROP COLUMN "contratoContrato"`);
        await queryRunner.query(`ALTER TABLE "parcelas" ADD CONSTRAINT "PK_8606f99f75b4e1b2709896272bd" PRIMARY KEY ("contratoId", "datavencimento")`);
        await queryRunner.query(`ALTER TABLE "contratos" ADD CONSTRAINT "UQ_e516e597e5f1d0fb590a0553e5a" UNIQUE ("contrato")`);
        await queryRunner.query(`ALTER TABLE "parcelas" DROP CONSTRAINT "UQ_8606f99f75b4e1b2709896272bd"`);
        await queryRunner.query(`ALTER TABLE "parcelas" DROP CONSTRAINT "PK_8606f99f75b4e1b2709896272bd"`);
        await queryRunner.query(`ALTER TABLE "parcelas" ADD CONSTRAINT "PK_13a2ac4b77e881130be7ea247aa" PRIMARY KEY ("datavencimento")`);
        await queryRunner.query(`ALTER TABLE "parcelas" DROP COLUMN "contratoId"`);
        await queryRunner.query(`ALTER TABLE "parcelas" ADD "contratoId" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "parcelas" DROP CONSTRAINT "PK_13a2ac4b77e881130be7ea247aa"`);
        await queryRunner.query(`ALTER TABLE "parcelas" ADD CONSTRAINT "PK_8606f99f75b4e1b2709896272bd" PRIMARY KEY ("datavencimento", "contratoId")`);
        await queryRunner.query(`ALTER TABLE "parcelas" ADD CONSTRAINT "UQ_8606f99f75b4e1b2709896272bd" UNIQUE ("contratoId", "datavencimento")`);
        await queryRunner.query(`ALTER TABLE "parcelas" ADD CONSTRAINT "FK_f81ae51ba4fb9c8a6a1b951abe5" FOREIGN KEY ("contratoId") REFERENCES "contratos"("contrato") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcelas" DROP CONSTRAINT "FK_f81ae51ba4fb9c8a6a1b951abe5"`);
        await queryRunner.query(`ALTER TABLE "parcelas" DROP CONSTRAINT "UQ_8606f99f75b4e1b2709896272bd"`);
        await queryRunner.query(`ALTER TABLE "parcelas" DROP CONSTRAINT "PK_8606f99f75b4e1b2709896272bd"`);
        await queryRunner.query(`ALTER TABLE "parcelas" ADD CONSTRAINT "PK_13a2ac4b77e881130be7ea247aa" PRIMARY KEY ("datavencimento")`);
        await queryRunner.query(`ALTER TABLE "parcelas" DROP COLUMN "contratoId"`);
        await queryRunner.query(`ALTER TABLE "parcelas" ADD "contratoId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "parcelas" DROP CONSTRAINT "PK_13a2ac4b77e881130be7ea247aa"`);
        await queryRunner.query(`ALTER TABLE "parcelas" ADD CONSTRAINT "PK_8606f99f75b4e1b2709896272bd" PRIMARY KEY ("contratoId", "datavencimento")`);
        await queryRunner.query(`ALTER TABLE "parcelas" ADD CONSTRAINT "UQ_8606f99f75b4e1b2709896272bd" UNIQUE ("contratoId", "datavencimento")`);
        await queryRunner.query(`ALTER TABLE "contratos" DROP CONSTRAINT "UQ_e516e597e5f1d0fb590a0553e5a"`);
        await queryRunner.query(`ALTER TABLE "parcelas" DROP CONSTRAINT "PK_8606f99f75b4e1b2709896272bd"`);
        await queryRunner.query(`ALTER TABLE "parcelas" ADD "contratoContrato" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "parcelas" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "parcelas" ADD CONSTRAINT "PK_2081f431fed935a5bb1da9f420b" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "parcelas" ADD CONSTRAINT "FK_8ab6d3e03949ea6a61851eeb6b9" FOREIGN KEY ("contratoContrato") REFERENCES "contratos"("contrato") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
