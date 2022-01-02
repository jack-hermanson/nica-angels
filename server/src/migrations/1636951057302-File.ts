import { MigrationInterface, QueryRunner, Table } from "typeorm";
import {
    createdColumn,
    deletedColumn,
    idColumn,
    updatedColumn,
} from "jack-hermanson-ts-utils";

export class File1636951057302 implements MigrationInterface {
    file = new Table({
        name: "file",
        columns: [
            idColumn,
            updatedColumn,
            createdColumn,
            deletedColumn,
            {
                name: "data",
                type: "varchar",
                isNullable: false,
            },
            {
                name: "mimeType",
                type: "varchar",
                isNullable: false,
            },
        ],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.file, true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.file, true);
    }
}
