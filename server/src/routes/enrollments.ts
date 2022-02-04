import { Response, Router } from "express";
import { auth } from "../middleware/auth";
import { Request } from "../utils/Request";
import {
    Clearance,
    EnrollmentRecord,
    EnrollmentRequest,
    SchoolEnrollmentStats,
} from "@nica-angels/shared";
import { authorized } from "../utils/functions";
import { EnrollmentService } from "../services/EnrollmentService";
import { HTTP, validateRequest } from "jack-hermanson-ts-utils";
import { enrollmentSchema } from "../models/Enrollment";

export const router = Router();

router.get(
    "/",
    auth,
    async (req: Request<any>, res: Response<EnrollmentRecord[]>) => {
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.SPONSOR,
                res,
            })
        ) {
            return;
        }

        const enrollments = await EnrollmentService.getAll();
        if (enrollments === undefined) {
            res.sendStatus(HTTP.SERVER_ERROR);
        }
        res.json(enrollments);
    }
);

router.get(
    "/:id",
    auth,
    async (req: Request<{ id: number }>, res: Response<EnrollmentRecord>) => {
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.SPONSOR,
                res,
            })
        ) {
            return;
        }

        const id = req.params.id;

        const enrollment = await EnrollmentService.getOne(id, res);
        if (!enrollment) {
            return;
        }
        res.json(enrollment);
    }
);

router.post(
    "/",
    auth,
    async (
        req: Request<EnrollmentRequest>,
        res: Response<EnrollmentRecord>
    ) => {
        const enrollmentRequest = await getEnrollmentRequest(req, res);
        if (!enrollmentRequest) {
            return;
        }

        const enrollment = await EnrollmentService.create(
            enrollmentRequest,
            res
        );
        if (!enrollment) {
            return;
        }

        res.status(HTTP.CREATED).json(enrollment);
    }
);

router.put(
    "/:id",
    auth,
    async (
        req: Request<{ id: number } & EnrollmentRequest>,
        res: Response<EnrollmentRecord>
    ) => {
        const enrollmentRequest = await getEnrollmentRequest(req, res);
        if (!enrollmentRequest) {
            return;
        }

        const editedEnrollment = await EnrollmentService.editEnrollment({
            id: req.params.id,
            res,
            enrollmentRequest,
        });
        if (!editedEnrollment) {
            return;
        }

        res.json(editedEnrollment);
    }
);

router.get(
    "/stats/:schoolId",
    auth,
    async (
        req: Request<{ schoolId: string }>,
        res: Response<SchoolEnrollmentStats>
    ) => {
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.ADMIN,
                res,
            })
        ) {
            return;
        }

        const schoolId = parseInt(req.params.schoolId);
        const statistics = await EnrollmentService.getStatistics(schoolId, res);

        res.json(statistics);
    }
);

async function getEnrollmentRequest(
    req: Request<EnrollmentRequest>,
    res: Response
): Promise<EnrollmentRequest | undefined> {
    if (
        !authorized({
            requestingAccount: req.account,
            minClearance: Clearance.ADMIN,
            res,
        })
    ) {
        return undefined;
    }

    if (!(await validateRequest(enrollmentSchema, req, res))) {
        return undefined;
    }

    return req.body as EnrollmentRequest;
}
