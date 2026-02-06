import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnsToExercises1770403138303 implements MigrationInterface {
    name = 'AddColumnsToExercises1770403138303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "exercise" DROP COLUMN "createdAt"`);
    }

}
