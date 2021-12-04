import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class FileName1637116829391 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "file",
            new TableColumn({
                name: "name",
                isNullable: false,
                type: "varchar",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("file", "name");
    }
}
