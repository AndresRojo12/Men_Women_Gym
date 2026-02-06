import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExercises1770396317927 implements MigrationInterface {
    name = 'CreateExercises1770396317927'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "exercise" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "level" character varying NOT NULL, CONSTRAINT "PK_a0f107e3a2ef2742c1e91d97c14" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "exercise"`);
    }

}
