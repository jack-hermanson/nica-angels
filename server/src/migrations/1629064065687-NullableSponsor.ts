import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class NullableSponsor1629064065687 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            "sponsor",
            "accountId",
            new TableColumn({
                name: "accountId",
                type: "int",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            "sponsor",
            "accountId",
            new TableColumn({
                name: "accountId",
                type: "int",
                isNullable: false,
            })
        );
    }
}
