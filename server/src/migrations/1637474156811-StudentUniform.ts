import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class StudentUniform1637474156811 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "student",
            new TableColumn({
                name: "uniform",
                type: "boolean",
                isNullable: false,
                default: false,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("student", "uniform");
    }
}
