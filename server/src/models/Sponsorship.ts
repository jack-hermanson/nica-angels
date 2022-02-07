import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import Joi from "joi";

@Entity({ name: "sponsorship" })
export class Sponsorship {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    studentId!: number;

    @Column({ nullable: false })
    sponsorId!: number;

    @Column({ nullable: false })
    startDate!: Date;

    @Column({ nullable: true })
    endDate?: Date;

    @Column({ nullable: false })
    payment!: number;

    @Column({ nullable: false })
    frequency!: number;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @DeleteDateColumn()
    deleted?: Date;
}

export const sponsorshipSchema = Joi.object().keys({
    studentId: Joi.number().integer().positive().required(),
    sponsorId: Joi.number().integer().positive().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().optional(),
    payment: Joi.number().positive().required(),
    frequency: Joi.number().integer().positive().required(),
});
