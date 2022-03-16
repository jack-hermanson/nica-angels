import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";
import { idColumn } from "jack-hermanson-ts-utils";

export class PaymentLog1647459010959 implements MigrationInterface {
    paymentLogTable = new Table({
        name: "payment_log",
        columns: [
            idColumn,
            new TableColumn({
                name: "accountId",
                type: "int",
                isNullable: false,
            }),
            new TableColumn({
                name: "ipAddress",
                type: "varchar",
                isNullable: false,
            }),
            new TableColumn({
                name: "notes",
                type: "varchar",
                isNullable: false,
            }),
        ],
    });

    accountIdFk = new TableForeignKey({
        referencedColumnNames: ["id"],
        referencedTableName: "account",
        columnNames: ["accountId"],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.paymentLogTable);
        await queryRunner.createForeignKeys(this.paymentLogTable, [
            this.accountIdFk,
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKeys(this.paymentLogTable, [
            this.accountIdFk,
        ]);
        await queryRunner.dropTable(this.paymentLogTable);
    }
}
