import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFoods1786124621602 implements MigrationInterface {
    name = 'CreateFoods1786124621602'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "foods" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "calories" integer NOT NULL, "protein" integer NOT NULL, "carbohydrates" integer NOT NULL, "fats" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0cc83421325632f61fa27a52b59" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "foods"`);
    }

}
