import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";
import Joi from "joi";

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

export const tokenLoginSchema = Joi.object().keys({
    data: Joi.string().required(),
});
