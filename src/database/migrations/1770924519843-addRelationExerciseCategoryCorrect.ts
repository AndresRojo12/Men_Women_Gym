import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationExerciseCategoryCorrect1770924519843 implements MigrationInterface {
    name = 'AddRelationExerciseCategoryCorrect1770924519843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" ADD "category_id" integer`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD CONSTRAINT "FK_977a54be5b15644bf5dc22093d5" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" DROP CONSTRAINT "FK_977a54be5b15644bf5dc22093d5"`);
        await queryRunner.query(`ALTER TABLE "exercise" DROP COLUMN "category_id"`);
    }

}
