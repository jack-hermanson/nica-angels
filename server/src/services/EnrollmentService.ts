import { Response } from "express";
import { getConnection, Repository } from "typeorm";
import { Enrollment } from "../models/Enrollment";
import { EnrollmentRequest } from "../../../shared/resource_models/enrollment";
import { StudentService } from "./StudentService";
import { SchoolService } from "./SchoolService";
import { School } from "../models/School";
import { Student } from "../models/Student";
import { HTTP } from "jack-hermanson-ts-utils";

export abstract class EnrollmentService {
    static getRepos(): { enrollmentRepo: Repository<Enrollment> } {
        const connection = getConnection();
        const enrollmentRepo = connection.getRepository(Enrollment);
        return { enrollmentRepo };
    }

    static async getOne(
        id: number,
        res: Response
    ): Promise<Enrollment | undefined> {
        const { enrollmentRepo } = this.getRepos();
        const enrollment = await enrollmentRepo.findOne(id);
        if (!enrollment) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }
        return enrollment;
    }

    static async getAll(): Promise<Enrollment[]> {
        const { enrollmentRepo } = this.getRepos();

        return await enrollmentRepo.find();
    }

    static async createEnrollment(
        enrollmentRequest: EnrollmentRequest,
        res: Response
    ): Promise<Enrollment | undefined> {
        const { enrollmentRepo } = this.getRepos();

        // Make sure student ID and school ID are good
        const { student, school } = await this.getStudentAndSchool(
            enrollmentRequest,
            res
        );
        if (!student || !school) {
            return undefined;
        }

        return await enrollmentRepo.save(enrollmentRequest);
    }

    static async editEnrollment({
        id,
        enrollmentRequest,
        res,
    }: {
        id: number;
        enrollmentRequest: EnrollmentRequest;
        res: Response;
    }): Promise<Enrollment | undefined> {
        const { enrollmentRepo } = this.getRepos();
        const enrollment = await enrollmentRepo.findOne(id);

        const { student, school } = await this.getStudentAndSchool(
            enrollmentRequest,
            res
        );
        if (!student || !school) {
            return undefined;
        }

        if (!enrollment) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        return await enrollmentRepo.save({
            ...enrollment,
            ...enrollmentRequest,
        });
    }

    private static async getStudentAndSchool(
        enrollmentRequest: EnrollmentRequest,
        res: Response
    ): Promise<
        | {
              school: School;
              student: Student;
          }
        | undefined
    > {
        const student = await StudentService.getOne(
            enrollmentRequest.studentId,
            res
        );
        if (!student) {
            return undefined;
        }
        const school = await SchoolService.getOne(
            enrollmentRequest.schoolId,
            res
        );
        if (!school) {
            return undefined;
        }
        return { school, student };
    }
}
