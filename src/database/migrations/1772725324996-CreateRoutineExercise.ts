import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRoutineExercise1772725324996 implements MigrationInterface {
    name = 'CreateRoutineExercise1772725324996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" DROP CONSTRAINT "FK_977a54be5b15644bf5dc22093d5"`);
        await queryRunner.query(`CREATE TABLE "routine_exercise" ("id" SERIAL NOT NULL, "sets" integer NOT NULL, "reps" integer NOT NULL, "restTime" integer, "weight" integer, "routineId" integer, "exerciseId" integer, CONSTRAINT "PK_867612b2de36b14fb318d4c5bbb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "exercise" DROP COLUMN "category_id"`);
        await queryRunner.query(`ALTER TABLE "routine_exercise" ADD CONSTRAINT "FK_ea225260712de406b1df66df325" FOREIGN KEY ("routineId") REFERENCES "routine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "routine_exercise" ADD CONSTRAINT "FK_fa839ca35528b181e0df5a8f9ef" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "routine_exercise" DROP CONSTRAINT "FK_fa839ca35528b181e0df5a8f9ef"`);
        await queryRunner.query(`ALTER TABLE "routine_exercise" DROP CONSTRAINT "FK_ea225260712de406b1df66df325"`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD "category_id" integer NOT NULL`);
        await queryRunner.query(`DROP TABLE "routine_exercise"`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD CONSTRAINT "FK_977a54be5b15644bf5dc22093d5" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
