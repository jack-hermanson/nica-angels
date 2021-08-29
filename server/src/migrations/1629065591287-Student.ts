import { MigrationInterface, QueryRunner, Table } from "typeorm";
import {
    createdColumn,
    deletedColumn,
    idColumn,
    updatedColumn,
} from "jack-hermanson-ts-utils";

export class Student1629065591287 implements MigrationInterface {
    student = new Table({
        name: "student",
        columns: [
            idColumn,
            createdColumn,
            updatedColumn,
            deletedColumn,
            {
                name: "firstName",
                type: "varchar",
                isNullable: false,
            },
            {
                name: "middleName",
                type: "varchar",
                isNullable: true,
            },
            {
                name: "lastName",
                type: "varchar",
                isNullable: true,
            },
            {
                name: "dateOfBirth",
                type: "timestamp",
                isNullable: true,
            },
            {
                name: "sex",
                type: "int",
                isNullable: false,
            },
            {
                name: "level",
                type: "int",
                isNullable: false,
            },
            {
                name: "backpack",
                type: "boolean",
                isNullable: false,
            },
            {
                name: "shoes",
                type: "boolean",
                isNullable: false,
            },
            {
                name: "supplies",
                type: "boolean",
                isNullable: false,
            },
        ],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.student);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.student);
    }
}
