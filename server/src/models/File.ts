import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import Joi from "joi";

@Entity({ name: "file" })
export class File {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        nullable: false,
        type: process.env.DATABASE_DIALECT === "postgres" ? "bytea" : "blob",
    })
    data!: string;

    @Column({ nullable: false })
    mimeType!: string;

    @Column({ nullable: false })
    name!: string;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @DeleteDateColumn()
    deleted?: Date;
}

export const FileSchema = Joi.object().keys({
    data: Joi.required(),
    mimeType: Joi.string().required(),
    name: Joi.string().required(),
});