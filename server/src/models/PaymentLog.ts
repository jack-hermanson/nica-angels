import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "payment_log" })
export class PaymentLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    accountId!: number;

    @Column()
    ipAddress!: string;

    @Column()
    notes!: string;
}
