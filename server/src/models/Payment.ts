import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import { PaymentMethod } from "@nica-angels/shared";
import Joi from "joi";

@Entity({ name: "payment" })
export class Payment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    amount!: number;

    @Column({ nullable: false })
    paymentMethod!: PaymentMethod;

    @Column({ nullable: true })
    notes?: string;

    @Column({ nullable: false })
    sponsorshipId!: number;

    @Column({ nullable: true })
    referenceNumber?: string;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @DeleteDateColumn()
    deleted?: Date;
}

export const paymentSchema = Joi.object().keys({
    amount: Joi.number().positive().required(),
    paymentMethod: Joi.number()
        .integer()
        .min(PaymentMethod.CREDIT_DEBIT_CARD)
        .max(PaymentMethod.ACH_BANK_TRANSFER)
        .required(),
    notes: Joi.string().optional(),
    sponsorshipId: Joi.number().integer().positive().required(),
    referenceNumber: Joi.string().optional(),
});
