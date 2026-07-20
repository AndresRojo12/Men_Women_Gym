import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNutritionPlan1784585463834 implements MigrationInterface {
    name = 'CreateNutritionPlan1784585463834'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "nutrition_plan" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "nutrition_goals_id" integer NOT NULL, CONSTRAINT "PK_cbf8d655e40107533330904e181" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "nutrition_plan" ADD CONSTRAINT "FK_c49d9590daafa0268b35f3166df" FOREIGN KEY ("nutrition_goals_id") REFERENCES "nutrition_goals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nutrition_plan" DROP CONSTRAINT "FK_c49d9590daafa0268b35f3166df"`);
        await queryRunner.query(`DROP TABLE "nutrition_plan"`);
    }

}
