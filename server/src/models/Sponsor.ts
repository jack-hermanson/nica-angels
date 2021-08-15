import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import Joi from "joi";

@Entity({ name: "sponsor" })
export class Sponsor {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    accountId?: number;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @DeleteDateColumn()
    deleted?: Date;
}

export const sponsorSchema = Joi.object().options({ abortEarly: false }).keys({
    accountId: Joi.number().integer().required(),
});
