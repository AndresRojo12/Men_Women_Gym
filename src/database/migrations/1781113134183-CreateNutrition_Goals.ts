import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNutritionGoals1781113134183 implements MigrationInterface {
    name = 'CreateNutritionGoals1781113134183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "nutrition_goals" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_00e7178a8b3045aae14e5c15756" UNIQUE ("name"), CONSTRAINT "PK_843d6ec58065c4f34aabc9052a3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "nutrition_goals"`);
    }

}
