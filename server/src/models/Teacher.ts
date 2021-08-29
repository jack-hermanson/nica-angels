import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({ name: "teacher" })
export class Teacher {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column({ nullable: false })
    name!: string;

    @Column({ nullable: false })
    schoolId!: number;

    @Column({ nullable: false })
    level!: string;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @DeleteDateColumn()
    deleted?: Date;
}
