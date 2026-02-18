import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveNameFromUser1771441186065 implements MigrationInterface {
    name = 'RemoveNameFromUser1771441186065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying NOT NULL`);
    }

}
