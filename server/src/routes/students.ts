import { Response, Router } from "express";
import { Request } from "../utils/Request";
import { auth } from "../middleware/auth";
import { StudentService } from "../services/StudentService";
import {
    Clearance,
    GetStudentsRequest,
    StudentRecord,
    StudentRequest,
} from "@nica-angels/shared";
import { authorized } from "../utils/functions";
import {
    AggregateResourceModel,
    HTTP,
    validateRequest,
} from "jack-hermanson-ts-utils";
import { studentSchema } from "../models/Student";
import { EnrollmentService } from "../services/EnrollmentService";
import { logger } from "../utils/logger";

export const router = Router();

router.get(
    "/",
    auth,
    async (
        req: Request<{}, {}, {}, GetStudentsRequest>,
        res: Response<AggregateResourceModel<StudentRecord>>
    ) => {
        const students = await StudentService.getAll(req.query);

        const studentsWithEnrollments: StudentRecord[] = [];
        for (let student of students.items) {
            const currentEnrollment =
                await EnrollmentService.getCurrentEnrollment(student.id);
            studentsWithEnrollments.push({
                ...student,
                schoolId: currentEnrollment?.schoolId,
            });
        }

        res.json({
            ...students,
            items: studentsWithEnrollments,
        });
    }
);

router.get("/count", auth, async (req: Request<any>, res: Response<number>) => {
    if (
        !authorized({
            requestingAccount: req.account,
            minClearance: Clearance.SPONSOR,
            res,
        })
    ) {
        return;
    }

    const count = await StudentService.getCount();
    res.status(HTTP.OK).json(count);
});

router.get(
    "/no-sponsor",
    auth,
    async (req: Request<any>, res: Response<StudentRecord[]>) => {
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.SPONSOR,
                res,
            })
        ) {
            return;
        }

        const students = await StudentService.getStudentsWithoutSponsors();
        res.json(students);
    }
);

router.get(
    "/:id",
    auth,
    async (req: Request<{ id: number }>, res: Response<StudentRecord>) => {
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.SPONSOR,
                res,
            })
        ) {
            return;
        }
        const student = await StudentService.getOne(req.params.id, res);
        if (!student) {
            return;
        }
        const enrollment = await EnrollmentService.getCurrentEnrollment(
            student.id
        );
        res.json({ ...student, schoolId: enrollment?.schoolId });
    }
);

router.post(
    "/",
    auth,
    async (req: Request<StudentRequest>, res: Response<StudentRecord>) => {
        const studentRequest: StudentRequest = await getStudentRequest(
            req,
            res
        );
        if (!studentRequest) {
            return;
        }
        const student = await StudentService.createStudent(studentRequest, res);
        res.status(HTTP.CREATED).json(student);
    }
);

router.put(
    "/:id",
    auth,
    async (
        req: Request<StudentRequest & { id: number }>,
        res: Response<StudentRecord>
    ) => {
        logger.info(
            `PUT /students/${req.params.id} by account ID #${req.account.id}`
        );
        const studentRequest = await getStudentRequest(req, res);
        if (!studentRequest) {
            return;
        }
        const id: number = req.params.id;

        const student = await StudentService.updateStudent({
            res,
            id,
            studentRequest,
        });
        if (!student) {
            return;
        }
        res.json(student);
    }
);

router.post(
    "/graduate",
    auth,
    async (req: Request<any>, res: Response<boolean>) => {
        logger.info(
            `${req.account.firstName} ${req.account.lastName} (#${req.account.id}) is graduating students.`
        );
        const graduated = await StudentService.graduate();
        res.json(graduated);
    }
);

async function getStudentRequest(
    req: Request<StudentRequest & any>,
    res: Response
): Promise<StudentRequest | undefined> {
    if (
        !authorized({
            requestingAccount: req.account,
            minClearance: Clearance.ADMIN,
            res,
        })
    ) {
        return undefined;
    }
    if (!(await validateRequest(studentSchema, req, res))) {
        return undefined;
    }
    return req.body as StudentRequest;
}
