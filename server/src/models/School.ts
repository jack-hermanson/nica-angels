import {
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";
import Joi from "joi";

@Entity({ name: "school" })
export class School {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    name!: string;

    @Column({ nullable: false })
    townId!: number;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @DeleteDateColumn()
    deleted?: Date;
}

export const schoolSchema = Joi.object().keys({
    name: Joi.string().required(),
    townId: Joi.number().integer().positive().required(),
});
