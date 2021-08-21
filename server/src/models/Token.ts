import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "token" })
export class Token {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    accountId!: number;

    @CreateDateColumn()
    created!: Date;

    @Column({ nullable: false })
    data!: string;
}
