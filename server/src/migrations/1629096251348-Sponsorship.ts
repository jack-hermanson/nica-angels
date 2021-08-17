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

export class Sponsorship1629096251348 implements MigrationInterface {
    sponsorship = new Table({
        name: "sponsorship",
        columns: [
            idColumn,
            createdColumn,
            updatedColumn,
            deletedColumn,
            {
                name: "sponsorId",
                type: "int",
                isNullable: false,
            },
            {
                name: "studentId",
                type: "int",
                isNullable: false,
            },
            {
                name: "startDate",
                type: "timestamp",
                isNullable: false,
            },
            {
                name: "endDate",
                type: "timestamp",
                isNullable: true,
            },
            {
                name: "payment",
                type: "float",
                isNullable: false,
            },
            {
                name: "frequency",
                type: "int",
                isNullable: false,
            },
        ],
    });

    sponsorIdForeignKey = new TableForeignKey({
        referencedTableName: "sponsor",
        referencedColumnNames: ["id"],
        columnNames: ["sponsorId"],
    });

    studentIdForeignKey = new TableForeignKey({
        referencedTableName: "student",
        referencedColumnNames: ["id"],
        columnNames: ["studentId"],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.sponsorship);
        await queryRunner.createForeignKeys(this.sponsorship, [
            this.sponsorIdForeignKey,
            this.studentIdForeignKey,
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKeys(this.sponsorship, [
            this.sponsorIdForeignKey,
            this.studentIdForeignKey,
        ]);
        await queryRunner.createTable(this.sponsorship);
    }
}
