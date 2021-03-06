import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Clearance } from "@nica-angels/shared";
import Joi from "joi";

@Entity({ name: "account" })
export class Account {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    firstName!: string;

    @Column({ nullable: false })
    lastName!: string;

    @Column({ nullable: false })
    email!: string;

    @Column({ nullable: false })
    password!: string;

    @Column({ nullable: false, default: Clearance.NONE })
    clearance!: Clearance;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @DeleteDateColumn()
    deleted?: Date;
}

const passwordSchema = Joi.string().min(2);

const baseSchema = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
};

export const newAccountSchema = Joi.object().keys({
    ...baseSchema,
    password: passwordSchema.required(),
});

export const editMyAccountSchema = Joi.object().keys({
    ...baseSchema,
    password: passwordSchema.optional(),
});

export const adminEditAccountSchema = Joi.object().keys({
    ...baseSchema,
    password: passwordSchema.optional(),
    clearance: Joi.number()
        .min(Clearance.NONE)
        .max(Clearance.SUPER_ADMIN)
        .required(),
});

export const loginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: passwordSchema.required(),
});

export const logoutSchema = Joi.object().keys({
    token: Joi.string().required(),
    logOutEverywhere: Joi.boolean().required(),
});
