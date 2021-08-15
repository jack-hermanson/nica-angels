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
            createdColumn,
            updatedColumn,
            deletedColumn,
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
