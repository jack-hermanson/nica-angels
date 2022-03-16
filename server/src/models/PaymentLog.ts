import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "payment_log" })
export class PaymentLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    accountId!: number;

    @Column()
    paymentId!: number;

    @Column()
    ipAddress!: string;

    @Column()
    notes!: string;

    @CreateDateColumn()
    created!: Date;
}
