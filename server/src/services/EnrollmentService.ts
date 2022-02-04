import { Response } from "express";
import { getConnection, Repository } from "typeorm";
import { Enrollment } from "../models/Enrollment";
import { EnrollmentRequest, SchoolEnrollmentStats } from "@nica-angels/shared";
import { StudentService } from "./StudentService";
import { SchoolService } from "./SchoolService";
import { School } from "../models/School";
import { Student } from "../models/Student";
import { HTTP } from "jack-hermanson-ts-utils";
import { logger } from "../utils/logger";

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

    static async getAll(): Promise<Enrollment[] | undefined> {
        const { enrollmentRepo } = this.getRepos();

        try {
            const query = enrollmentRepo
                .createQueryBuilder("enrollment")
                .orderBy("enrollment.startDate", "DESC");
            logger.info("Get enrollment query");
            logger.info(query.getSql());
            return await query.getMany();
        } catch (error) {
            logger.fatal(error);
            return undefined;
        }
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

    /**
     * Get the current enrollment numbers for each grade at a certain school.
     * @param schoolId - The ID of the school you want statistics for.
     * @param res - The response object from the express route.
     */
    static async getStatistics(
        schoolId: number,
        res: Response
    ): Promise<SchoolEnrollmentStats | undefined> {
        const school = await SchoolService.getOne(schoolId, res);
        if (!school) {
            return undefined;
        }

        const { enrollmentRepo } = this.getRepos();

        // Adding .andWhere() clauses modifies the query builder by reference.
        // This function will return a new query builder each time.
        const enrollmentsQuery = () =>
            enrollmentRepo
                .createQueryBuilder("enrollment")
                .innerJoinAndSelect(
                    "student",
                    "student",
                    "enrollment.studentId = student.id"
                )
                .where("enrollment.endDate IS NULL")
                .andWhere(`enrollment.schoolId = ${schoolId}`);

        const output: SchoolEnrollmentStats = {
            schoolId: schoolId,
            grade0: await enrollmentsQuery()
                .andWhere("student.level = 0")
                .getCount(),
            grade1: await enrollmentsQuery()
                .andWhere("student.level = 1")
                .getCount(),
            grade2: await enrollmentsQuery()
                .andWhere("student.level = 2")
                .getCount(),
            grade3: await enrollmentsQuery()
                .andWhere("student.level = 3")
                .getCount(),
            grade4: await enrollmentsQuery()
                .andWhere("student.level = 4")
                .getCount(),
            grade5: await enrollmentsQuery()
                .andWhere("student.level = 5")
                .getCount(),
            grade6: await enrollmentsQuery()
                .andWhere("student.level = 6")
                .getCount(),
            grade7: await enrollmentsQuery()
                .andWhere("student.level = 7")
                .getCount(),
            grade8: await enrollmentsQuery()
                .andWhere("student.level = 8")
                .getCount(),
            other: await enrollmentsQuery()
                .andWhere("student.level > 8")
                .getCount(),
        };

        logger.info(
            "Successfully generated queries for enrollment statistics."
        );
        logger.debug(enrollmentsQuery().getSql());

        return output;
    }
}
