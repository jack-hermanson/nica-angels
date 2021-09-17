import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import Joi from "joi";

@Entity({ name: "enrollment" })
export class Enrollment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    schoolId!: number;

    @Column({ nullable: false })
    studentId!: number;

    @Column({ nullable: true })
    startDate?: Date;

    @Column({ nullable: true })
    endDate?: Date;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @DeleteDateColumn()
    deleted?: Date;
}

export const enrollmentSchema = Joi.object().keys({
    schoolId: Joi.number().integer().required(),
    studentId: Joi.number().integer().required(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
});
