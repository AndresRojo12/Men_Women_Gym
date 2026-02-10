import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueToExercises1770408528734 implements MigrationInterface {
    name = 'AddUniqueToExercises1770408528734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" ADD CONSTRAINT "UQ_4420597915e901ab5d6f2bcaee4" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" DROP CONSTRAINT "UQ_4420597915e901ab5d6f2bcaee4"`);
    }

}
