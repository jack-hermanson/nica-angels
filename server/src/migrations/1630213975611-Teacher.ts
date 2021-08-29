import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from "typeorm";
import {
    createdColumn,
    deletedColumn,
    idColumn,
    updatedColumn,
} from "jack-hermanson-ts-utils";

export class Teacher1630213975611 implements MigrationInterface {
    teacher = new Table({
        name: "teacher",
        columns: [
            idColumn,
            updatedColumn,
            createdColumn,
            deletedColumn,
            {
                name: "name",
                type: "varchar",
                isNullable: false,
            },
            {
                name: "schoolId",
                type: "int",
                isNullable: false,
            },
            {
                name: "level",
                type: "varchar",
                isNullable: false,
            },
        ],
    });

    schoolIdForeignKey = new TableForeignKey({
        referencedTableName: "school",
        referencedColumnNames: ["id"],
        columnNames: ["schoolId"],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.teacher);
        await queryRunner.createForeignKeys(this.teacher, [
            this.schoolIdForeignKey,
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKeys(this.teacher, [
            this.schoolIdForeignKey,
        ]);
        await queryRunner.dropTable(this.teacher);
    }
}
