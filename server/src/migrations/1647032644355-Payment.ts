import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";
import {
    createdColumn,
    deletedColumn,
    idColumn,
    updatedColumn,
} from "jack-hermanson-ts-utils";

export class Payment1647032644355 implements MigrationInterface {
    paymentTable = new Table({
        name: "payment",
        columns: [
            idColumn,
            new TableColumn({
                name: "amount",
                type: "float",
                isNullable: false,
            }),
            new TableColumn({
                name: "paymentMethod",
                type: "int",
                isNullable: false,
            }),
            new TableColumn({
                name: "notes",
                type: "varchar",
                isNullable: true,
            }),
            new TableColumn({
                name: "sponsorshipId",
                type: "int",
                isNullable: false,
            }),
            new TableColumn({
                name: "referenceNumber",
                type: "varchar",
                isNullable: true,
            }),
            createdColumn,
            updatedColumn,
            deletedColumn,
        ],
    });

    sponsorshipIdFk = new TableForeignKey({
        referencedTableName: "sponsorship",
        referencedColumnNames: ["id"],
        columnNames: ["sponsorshipId"],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.paymentTable);
        await queryRunner.createForeignKeys(this.paymentTable, [
            this.sponsorshipIdFk,
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKeys(this.paymentTable, [
            this.sponsorshipIdFk,
        ]);
        await queryRunner.dropTable(this.paymentTable);
    }
}
