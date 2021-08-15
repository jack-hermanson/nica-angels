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
                name: "nickName",
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
        ],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.student);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.student);
    }
}
