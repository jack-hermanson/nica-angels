import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({ name: "file" })
export class File {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        nullable: false,
        type: process.env.DATABASE_DIALECT === "postgres" ? "bytea" : "blob",
    })
    data!: Buffer;

    @Column({ nullable: false })
    mimeType!: string;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @DeleteDateColumn()
    deleted?: Date;
}
