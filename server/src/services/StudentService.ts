import { getConnection, Repository } from "typeorm";
import { Student } from "../models/Student";
import { Response } from "express";
import {
    AggregateRequest,
    AggregateResourceModel,
    HTTP,
} from "jack-hermanson-ts-utils";
import { GetStudentsRequest, StudentRequest } from "../../../shared";

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
        searchText,
        orderBy = "firstName",
    }: GetStudentsRequest): Promise<AggregateResourceModel<Student>> {
        const { studentRepo } = this.getRepos();
        const studentsQuery = studentRepo
            .createQueryBuilder("student")
            .where(
                `LOWER(student.firstName) || ' ' || LOWER(student.lastName) LIKE '%${searchText.toLowerCase()}%'`
            )
            .orWhere(
                `LOWER(student.firstName) || ' ' || LOWER(student.middleName) LIKE '%${searchText.toLowerCase()}%'`
            )
            .orWhere(
                `LOWER(student.firstName) || ' ' || LOWER(student.middleName) || ' ' || LOWER(student.lastName) LIKE '%${searchText.toLowerCase()}%'`
            )
            .orWhere(
                `LOWER(student.firstName) LIKE '%${searchText.toLowerCase()}%'`
            )
            .orWhere(
                `LOWER(student.middleName) LIKE '%${searchText.toLowerCase()}%'`
            )
            .orWhere(
                `LOWER(student.lastName) LIKE '%${searchText.toLowerCase()}%'`
            )
            .orderBy(orderBy)
            .skip(skip)
            .take(take);
        const total = await studentsQuery.getCount();
        const students = await studentsQuery.getMany();
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
            lastName: studentRequest.lastName ? studentRequest.lastName : null,
            middleName: studentRequest.middleName
                ? studentRequest.middleName
                : null,
            dateOfBirth: studentRequest.dateOfBirth
                ? studentRequest.dateOfBirth
                : null,
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
