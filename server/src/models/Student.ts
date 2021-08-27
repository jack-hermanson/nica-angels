import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import Joi from "joi";

@Entity({ name: "student" })
export class Student {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    firstName!: string;

    @Column({ nullable: true })
    nickName?: string;

    @Column({ nullable: true })
    lastName?: string;

    @Column({ nullable: true })
    dateOfBirth?: Date;

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
});
