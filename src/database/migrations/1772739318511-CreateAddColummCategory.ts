import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAddColummCategory1772739318511 implements MigrationInterface {
    name = 'CreateAddColummCategory1772739318511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "exercise" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "level" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "category_id" integer NOT NULL, CONSTRAINT "UQ_4420597915e901ab5d6f2bcaee4" UNIQUE ("name"), CONSTRAINT "PK_a0f107e3a2ef2742c1e91d97c14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD CONSTRAINT "FK_977a54be5b15644bf5dc22093d5" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "routine_exercise" ADD CONSTRAINT "FK_fa839ca35528b181e0df5a8f9ef" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "routine_exercise" DROP CONSTRAINT "FK_fa839ca35528b181e0df5a8f9ef"`);
        await queryRunner.query(`ALTER TABLE "exercise" DROP CONSTRAINT "FK_977a54be5b15644bf5dc22093d5"`);
        await queryRunner.query(`DROP TABLE "exercise"`);
    }

}
