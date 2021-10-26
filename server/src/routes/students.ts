import { Response, Router } from "express";
import { Request } from "../utils/Request";
import { auth } from "../middleware/auth";
import { StudentService } from "../services/StudentService";
import {
    GetStudentsRequest,
    StudentRecord,
    StudentRequest,
} from "../../../shared";
import { authorized } from "../utils/functions";
import { Clearance } from "../../../shared";
import {
    AggregateRequest,
    AggregateResourceModel,
    HTTP,
    validateRequest,
} from "jack-hermanson-ts-utils";
import { studentSchema } from "../models/Student";

export const router = Router();

router.get(
    "/",
    auth,
    async (
        req: Request<{}, {}, {}, GetStudentsRequest>,
        res: Response<AggregateResourceModel<StudentRecord>>
    ) => {
        const students = await StudentService.getAll(req.query);
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
        res.json(student);
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
        const student = await StudentService.createStudent(studentRequest);
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
