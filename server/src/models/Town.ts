import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import Joi from "joi";

@Entity({ name: "town" })
export class Town {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    name!: string;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @DeleteDateColumn()
    deleted?: Date;
}

export const townSchema = Joi.object().options({ abortEarly: false }).keys({
    name: Joi.string().required(),
});
