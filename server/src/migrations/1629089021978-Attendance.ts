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

export class Attendance1629089021978 implements MigrationInterface {
    enrollment = new Table({
        name: "enrollment",
        columns: [
            idColumn,
            createdColumn,
            updatedColumn,
            deletedColumn,
            {
                name: "startDate",
                type: "timestamp",
                isNullable: true,
            },
            {
                name: "endDate",
                type: "timestamp",
                isNullable: true,
            },
            {
                name: "schoolId",
                type: "int",
                isNullable: false,
            },
            {
                name: "studentId",
                type: "int",
                isNullable: false,
            },
        ],
    });

    schoolIdForeignKey = new TableForeignKey({
        referencedColumnNames: ["id"],
        referencedTableName: "school",
        columnNames: ["schoolId"],
    });

    studentIdForeignKey = new TableForeignKey({
        referencedColumnNames: ["id"],
        referencedTableName: "student",
        columnNames: ["studentId"],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.enrollment);
        await queryRunner.createForeignKeys(this.enrollment, [
            this.schoolIdForeignKey,
            this.studentIdForeignKey,
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKeys(this.enrollment, [
            this.schoolIdForeignKey,
            this.studentIdForeignKey,
        ]);
        await queryRunner.dropTable(this.enrollment);
    }
}
