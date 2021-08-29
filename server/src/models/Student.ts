import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import Joi from "joi";
import { Sex } from "jack-hermanson-ts-utils";

@Entity({ name: "student" })
export class Student {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    firstName!: string;

    @Column({ nullable: true })
    middleName?: string;

    @Column({ nullable: true })
    lastName?: string;

    @Column({ nullable: true })
    dateOfBirth?: Date;

    @Column({ nullable: false })
    sex!: Sex;

    @Column({ nullable: false })
    level!: number;

    @Column({ nullable: false })
    backpack!: boolean;

    @Column({ nullable: false })
    shoes!: boolean;

    @Column({ nullable: false })
    supplies!: boolean;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @DeleteDateColumn()
    deleted?: Date;
}

export const studentSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    nickName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
    sex: Joi.number().min(Sex.FEMALE).max(Sex.MALE).integer().required(),
    level: Joi.number().integer().positive().required(),
    backpack: Joi.boolean().required(),
    shoes: Joi.boolean().required(),
    supplies: Joi.boolean().required(),
});
