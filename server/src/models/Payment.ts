import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import { PaymentMethod } from "@nica-angels/shared";

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
