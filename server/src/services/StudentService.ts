import { getConnection, Repository } from "typeorm";
import { Student } from "../models/Student";
import { Response } from "express";
import {
    AggregateRequest,
    AggregateResourceModel,
    HTTP,
} from "jack-hermanson-ts-utils";
import { StudentRequest } from "../../../shared/resource_models/student";

export class StudentService {
    static getRepos(): {
        studentRepo: Repository<Student>;
    } {
        const connection = getConnection();
        const studentRepo = connection.getRepository(Student);
        return { studentRepo };
    }

    static async getAll({
        skip,
        take,
    }: AggregateRequest): Promise<AggregateResourceModel<Student>> {
        const { studentRepo } = this.getRepos();
        const students = await studentRepo
            .createQueryBuilder("student")
            .skip(skip)
            .take(take)
            .getMany();
        const total = await studentRepo.count();
        return {
            items: students,
            skip,
            take,
            total,
            count: students.length,
        };
    }

    static async getOne(
        id: number,
        res: Response
    ): Promise<Student | undefined> {
        const { studentRepo } = this.getRepos();
        const student = await studentRepo.findOne(id);
        if (!student) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }
        return student;
    }

    static async createStudent(
        studentRequest: StudentRequest
    ): Promise<Student> {
        const { studentRepo } = this.getRepos();
        return await studentRepo.save(studentRequest);
    }

    static async updateStudent({
        id,
        studentRequest,
        res,
    }: {
        id: number;
        studentRequest: StudentRequest;
        res: Response;
    }): Promise<Student> {
        const { studentRepo } = this.getRepos();
        const student = await studentRepo.findOne(id);
        if (!student) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        return await studentRepo.save({
            ...student,
            ...studentRequest,
        });
    }

    static async newSchoolYear(): Promise<Student[]> {
        const { studentRepo } = this.getRepos();
        const students = await studentRepo.find();

        for (let student of students) {
            await studentRepo.save({
                ...student,
                level: student.level + 1,
            });
        }

        return await studentRepo.find();
    }
}
