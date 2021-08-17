import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from "typeorm";
import { createdColumn, idColumn } from "jack-hermanson-ts-utils";

export class Token1629053978130 implements MigrationInterface {
    token = new Table({
        name: "token",
        columns: [
            idColumn,
            createdColumn,
            {
                name: "accountId",
                type: "int",
                isNullable: false,
            },
        ],
    });

    accountIdForeignKey = new TableForeignKey({
        referencedTableName: "account",
        referencedColumnNames: ["id"],
        columnNames: ["accountId"],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.token);
        await queryRunner.createForeignKeys(this.token, [
            this.accountIdForeignKey,
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKeys(this.token, [
            this.accountIdForeignKey,
        ]);
        await queryRunner.dropTable(this.token);
    }
}
