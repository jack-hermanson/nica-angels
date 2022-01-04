import { Response } from "express";
import { getConnection, Repository } from "typeorm";
import { Enrollment } from "../models/Enrollment";
import { EnrollmentRequest } from "@nica-angels/shared";
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

        return await enrollmentRepo
            .createQueryBuilder()
            .orderBy("startDate", "DESC")
            .getMany();
    }

    static async create(
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

        // end all existing enrollments
        await this.endEnrollments(student.id);

        return await enrollmentRepo.save({
            ...enrollmentRequest,
            startDate: new Date(),
        });
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
            id: enrollment.id,
            schoolId: enrollmentRequest.schoolId,
            studentId: enrollmentRequest.studentId,
            startDate: enrollmentRequest.startDate || null,
            endDate: enrollmentRequest.endDate || null,
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

    /**
     * Get the most recent enrollment for this student, if available.
     * @param studentId - The ID of the student whose enrollment you're looking for
     */
    static async getCurrentEnrollment(
        studentId: number
    ): Promise<Enrollment | undefined> {
        const { enrollmentRepo } = this.getRepos();
        const enrollments = await enrollmentRepo.find({
            studentId,
        });
        return enrollments
            .filter(e => e.endDate !== undefined)
            .sort((a, b) => {
                if (a.startDate === undefined && b.startDate !== undefined) {
                    return -1;
                }
                if (a.startDate !== undefined && b.startDate === undefined) {
                    return 1;
                }
                if (a.startDate === undefined && b.startDate === undefined) {
                    return 0;
                }
                if (a.startDate < b.startDate) {
                    return -1; // earlier
                }
                if (a.startDate > b.startDate) {
                    return 1; // later
                }
                return 0; // same
            })
            .reverse()[0];
    }

    static async endEnrollments(studentId: number): Promise<void> {
        const { enrollmentRepo } = this.getRepos();

        const enrollments = await enrollmentRepo.find({
            studentId: studentId,
        });
        if (enrollments.some(e => e.endDate !== undefined)) {
            for (const enrollment of enrollments) {
                await enrollmentRepo.save({
                    ...enrollment,
                    endDate: new Date(),
                });
            }
        }
    }
}
