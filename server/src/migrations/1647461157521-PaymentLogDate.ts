import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { createdColumn } from "jack-hermanson-ts-utils";

export class PaymentLogDate1647461157521 implements MigrationInterface {
    created = new TableColumn(createdColumn);

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("payment_log", this.created);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("payment_log", this.created);
    }
}
