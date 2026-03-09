import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnImage1773072646005 implements MigrationInterface {
    name = 'AddColumnImage1773072646005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ADD "image" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "image"`);
    }

}
