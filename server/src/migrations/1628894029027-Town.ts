import { MigrationInterface, QueryRunner, Table } from "typeorm";
import {
    createdColumn,
    deletedAtColumn,
    idColumn,
    updatedColumn,
} from "jack-hermanson-ts-utils";

export class Town1628894029027 implements MigrationInterface {
    town = new Table({
        name: "town",
        columns: [
            idColumn,
            createdColumn,
            updatedColumn,
            deletedAtColumn,
            {
                name: "name",
                type: "varchar",
                isNullable: false,
            },
        ],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.town);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.town);
    }
}
