import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from "typeorm";
import { idColumn } from "jack-hermanson-ts-utils";

export class Sponsor1628822369182 implements MigrationInterface {
    sponsor = new Table({
        name: "sponsor",
        columns: [
            idColumn,
            {
                name: "accountId",
                type: "int",
                isNullable: false,
            },
            {
                name: "created",
                type: "timestamp",
                isNullable: false,
                default: "CURRENT_TIMESTAMP",
            },
            {
                name: "updated",
                type: "timestamp",
                isNullable: false,
                default: "CURRENT_TIMESTAMP",
            },
            {
                name: "deletedAt",
                type: "timestamp",
                isNullable: true,
            },
        ],
    });

    accountIdForeignKey = new TableForeignKey({
        columnNames: ["accountId"],
        referencedTableName: "account",
        referencedColumnNames: ["id"],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.sponsor);
        await queryRunner.createForeignKeys(this.sponsor, [
            this.accountIdForeignKey,
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKeys(this.sponsor, [
            this.accountIdForeignKey,
        ]);
        await queryRunner.dropTable(this.sponsor);
    }
}
