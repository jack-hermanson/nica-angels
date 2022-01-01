import { MigrationInterface, QueryRunner, Table } from "typeorm";
import {
    createdColumn,
    deletedColumn,
    idColumn,
    updatedColumn,
} from "jack-hermanson-ts-utils";
import { Clearance } from "@nica-angels/shared";

export class Account1628820578982 implements MigrationInterface {
    account = new Table({
        name: "account",
        columns: [
            idColumn,
            {
                name: "firstName",
                type: "varchar",
                isNullable: false,
            },
            {
                name: "lastName",
                type: "varchar",
                isNullable: false,
            },
            {
                name: "email",
                type: "varchar",
                isNullable: false,
                isUnique: true,
            },
            {
                name: "password",
                type: "varchar",
                isNullable: false,
            },
            {
                name: "clearance",
                type: "int",
                isNullable: false,
                default: Clearance.NONE,
            },
            createdColumn,
            updatedColumn,
            deletedColumn,
        ],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.account);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.account);
    }
}
