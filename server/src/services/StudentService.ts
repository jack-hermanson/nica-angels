import { getConnection, Repository } from "typeorm";
import { Student } from "../models/Student";
import { Response } from "express";
import { AggregateResourceModel, HTTP } from "jack-hermanson-ts-utils";
import { GetStudentsRequest, StudentRequest } from "@nica-angels/shared";
import { FileService } from "./FileService";
import { EnrollmentService } from "./EnrollmentService";
import { logger } from "../utils/logger";
import moment from "moment";

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
        minLevel,
        maxLevel,
        orderBy = "student.firstName",
    }: GetStudentsRequest): Promise<AggregateResourceModel<Student>> {
        const { studentRepo } = this.getRepos();
        const pg: boolean = process.env.databaseDialect === "postgres";

        const studentsQuery = studentRepo
            .createQueryBuilder("student")
            .where(
                `student.level >= ${minLevel} AND student.level <= ${maxLevel}`
            )
            .andWhere(
                "( " +
                    (pg
                        ? `student.firstName || ' ' || student.lastName ILIKE '%${searchText.toLowerCase()}%'`
                        : `LOWER(student.firstName) || ' ' || LOWER(student.lastName) LIKE '%${searchText.toLowerCase()}%'`) +
                    " OR " +
                    (pg
                        ? `student.firstName || ' ' || student.middleName ILIKE '%${searchText.toLowerCase()}%'`
                        : `LOWER(student.firstName) || ' ' || LOWER(student.middleName) LIKE '%${searchText.toLowerCase()}%'`) +
                    " OR " +
                    (pg
                        ? `student.firstName || ' ' || student.middleName || ' ' || student.lastName ILIKE '%${searchText.toLowerCase()}%'`
                        : `LOWER(student.lastName) || ' ' || LOWER(student.middleName) || ' ' || LOWER(student.lastName) LIKE '%${searchText.toLowerCase()}%'`) +
                    " OR " +
                    (pg
                        ? `student.firstName ILIKE '%${searchText.toLowerCase()}%'`
                        : `LOWER(student.firstName) LIKE '%${searchText.toLowerCase()}%'`) +
                    " OR " +
                    (pg
                        ? `student.middleName ILIKE '%${searchText.toLowerCase()}%'`
                        : `LOWER(student.middleName) LIKE '%${searchText.toLowerCase()}%'`) +
                    `${
                        searchText.length
                            ? `OR "student"."id" = ${searchText}`
                            : ""
                    }` +
                    " OR " +
                    (pg
                        ? `student.lastName ILIKE '%${searchText.toLowerCase()}%'`
                        : `LOWER(student.lastName) LIKE '%${searchText.toLowerCase()}%'`) +
                    " )"
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
        studentRequest: StudentRequest,
        res: Response
    ): Promise<Student> {
        const { studentRepo } = this.getRepos();
        const newStudent = await studentRepo.save(studentRequest);
        await this.enroll(newStudent.id, studentRequest.schoolId, res);
        return newStudent;
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
        logger.debug("Updating student");
        const { studentRepo } = this.getRepos();
        const student = await studentRepo.findOne(id);
        if (!student) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        // enroll
        await this.enroll(student.id, studentRequest.schoolId, res);

        return await studentRepo.save({
            id: student.id,
            firstName: studentRequest.firstName,
            middleName: studentRequest.middleName || null,
            lastName: studentRequest.lastName || null,
            dateOfBirth: studentRequest.dateOfBirth || null,
            sex: studentRequest.sex,
            level: studentRequest.level,
            imageId: student.imageId, // keep the same
            uniform: studentRequest.uniform,
            shoes: studentRequest.shoes,
            supplies: studentRequest.supplies,
            schoolId: studentRequest.schoolId,
        });
    }

    static async enroll(
        studentId: number,
        schoolId: number | undefined,
        res: Response
    ): Promise<void> {
        const currentEnrollment = await EnrollmentService.getCurrentEnrollment(
            studentId
        );

        // if request has no school ID and there is no current enrollment,
        // or the school ID is the same as the current enrollment school ID
        if (
            (!currentEnrollment && !schoolId) ||
            (currentEnrollment && currentEnrollment.schoolId === schoolId)
        ) {
            // do nothing
            return;
        }

        // if there is a current enrollment but no school ID
        if (currentEnrollment && !schoolId) {
            // end enrollments
            await EnrollmentService.endEnrollments(studentId);
            return;
        }

        // otherwise, just create the enrollment
        await EnrollmentService.create(
            {
                schoolId: schoolId,
                studentId: studentId,
            },
            res
        );
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

    static async setProfilePicture({
        studentId,
        fileId,
        res,
    }: {
        studentId: number;
        fileId: number;
        res: Response;
    }): Promise<Student | undefined> {
        logger.debug("Setting student profile picture");
        const { studentRepo } = this.getRepos();
        const student = await this.getOne(studentId, res);
        if (!student) {
            return undefined;
        }
        const file = await FileService.getOne(fileId, res);
        if (!file) {
            return undefined;
        }
        const updatedStudent = await studentRepo.save({
            ...student,
            imageId: fileId,
        });
        logger.debug(`Updated student imageId: ${updatedStudent.imageId}`);
        return updatedStudent;
    }

    static async removeProfilePicture(imageId: number): Promise<boolean> {
        const { studentRepo } = this.getRepos();
        const studentsWithImage = await studentRepo.find({ imageId: imageId });

        if (!studentsWithImage.length) {
            return false;
        }

        for (let student of studentsWithImage) {
            await studentRepo.save({
                ...student,
                imageId: null,
            });
        }

        return true;
    }

    static async getCount(): Promise<number> {
        const { studentRepo } = this.getRepos();
        return await studentRepo.count();
    }

    static async getStudentsWithoutSponsors(): Promise<Student[]> {
        const connection = getConnection();
        const rawRecords = await connection.query(`
            SELECT
                "student"."id",
                "student"."firstName",
                "student"."middleName",
                "student"."lastName",
                "student"."dateOfBirth",
                "student"."sex",
                "student"."level",
                "student"."imageId",
                "student"."backpack",
                "student"."shoes",
                "student"."supplies",
                "student"."uniform",
                "student"."created",
                "student"."updated",
                "student"."deleted",
                "sponsorship"."studentId" AS "sponsorship_studentId",
                "sponsorship"."endDate" AS "sponsorship_endDate"
            FROM
                "student"
            LEFT JOIN
                "sponsorship"
            ON
                "sponsorship"."studentId" = "student"."id"
            WHERE 
                "sponsorship"."studentId" IS NULL
                OR "sponsorship"."endDate" IS NOT NULL;
        `);
        return rawRecords
            .filter(r => {
                if (r.endDate && moment(r.endDate).isBefore(moment.now())) {
                    return true;
                }
                return !r.endDate;
            })
            .map(r => {
                delete r.sponsorship_studentId;
                delete r.sponsorship_endDate;
                return r;
            });
    }

    static async graduate(): Promise<boolean> {
        logger.info("Graduating students");
        const { studentRepo } = this.getRepos();

        const students = await studentRepo.find();
        for (let student of students) {
            if (student.level < 9) {
                student.level++;
                await studentRepo.save(student);
            }
        }

        return true;
    }
}
