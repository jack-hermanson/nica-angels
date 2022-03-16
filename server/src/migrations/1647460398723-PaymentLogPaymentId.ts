import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from "typeorm";

export class PaymentLogPaymentId1647460398723 implements MigrationInterface {
    paymentId = new TableColumn({
        name: "paymentId",
        type: "int",
        isNullable: false,
    });

    paymentIdFk = new TableForeignKey({
        referencedTableName: "payment",
        referencedColumnNames: ["id"],
        columnNames: ["paymentId"],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("payment_log", this.paymentId);
        await queryRunner.createForeignKeys("payment_log", [this.paymentIdFk]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("payment_log", this.paymentId);
        await queryRunner.dropForeignKeys("payment_log", [this.paymentIdFk]);
    }
}
