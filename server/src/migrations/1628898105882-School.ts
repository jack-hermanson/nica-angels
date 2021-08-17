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

export class School1628898105882 implements MigrationInterface {
    school = new Table({
        name: "school",
        columns: [
            idColumn,
            createdColumn,
            updatedColumn,
            deletedColumn,
            {
                name: "name",
                type: "varchar",
                isNullable: false,
            },
            {
                name: "townId",
                type: "int",
                isNullable: false,
            },
        ],
    });

    townIdForeignKey = new TableForeignKey({
        columnNames: ["townId"],
        referencedColumnNames: ["id"],
        referencedTableName: "town",
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.school);
        await queryRunner.createForeignKeys(this.school, [
            this.townIdForeignKey,
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKeys(this.school, [this.townIdForeignKey]);
        await queryRunner.dropTable(this.school);
    }
}
