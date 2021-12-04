import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from "typeorm";

export class StudentImage1637366192733 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("student", [
            new TableColumn({
                name: "imageId",
                type: "int",
                isNullable: true,
                default: null,
            }),
        ]);
        await queryRunner.createForeignKeys("student", [
            new TableForeignKey({
                referencedColumnNames: ["id"],
                columnNames: ["imageId"],
                referencedTableName: "file",
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("student", "imageId");
        await queryRunner.dropColumn("student", "imageId");
    }
}
