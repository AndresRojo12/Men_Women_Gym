import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRelationRoutineCustomer1772479320481 implements MigrationInterface {
    name = 'CreateRelationRoutineCustomer1772479320481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "routine" ADD "customerId" integer`);
        await queryRunner.query(`ALTER TABLE "routine" ADD CONSTRAINT "FK_d2a14bf313ad925432f14e482b3" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "routine" DROP CONSTRAINT "FK_d2a14bf313ad925432f14e482b3"`);
        await queryRunner.query(`ALTER TABLE "routine" DROP COLUMN "customerId"`);
    }

}
