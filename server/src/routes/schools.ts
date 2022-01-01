import express, { Response } from "express";
import { auth } from "../middleware/auth";
import { Request } from "../utils/Request";
import { Clearance, SchoolRecord, SchoolRequest } from "@nica-angels/shared";
import { authorized } from "../utils/functions";
import { SchoolService } from "../services/SchoolService";
import { HTTP, validateRequest } from "jack-hermanson-ts-utils";
import { schoolSchema } from "../models/School";

export const router = express.Router();

router.get(
    "/",
    auth,
    async (req: Request<any>, res: Response<SchoolRecord[]>) => {
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.SPONSOR,
                res,
            })
        ) {
            return;
        }

        res.json(await SchoolService.getAll());
    }
);

router.post(
    "/",
    auth,
    async (req: Request<SchoolRequest>, res: Response<SchoolRecord>) => {
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.ADMIN,
                res,
            })
        ) {
            return;
        }

        if (!(await validateRequest(schoolSchema, req, res))) {
            return;
        }
        const schoolRequest: SchoolRequest = req.body;

        const school = await SchoolService.create(schoolRequest, res);
        if (!school) {
            return;
        }

        res.status(HTTP.CREATED).json(school);
    }
);

router.get(
    "/:id",
    auth,
    async (req: Request<{ id: number }>, res: Response<SchoolRecord>) => {
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.SPONSOR,
                res,
            })
        ) {
            return;
        }
        const school = await SchoolService.getOne(req.params.id, res);
        if (!school) {
            return;
        }
        res.json(school);
    }
);

router.put(
    "/:id",
    auth,
    async (
        req: Request<{ id: number } & SchoolRequest>,
        res: Response<SchoolRecord>
    ) => {
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.SPONSOR,
                res,
            })
        ) {
            return;
        }

        if (!(await validateRequest(schoolSchema, req, res))) {
            return undefined;
        }

        const school = await SchoolService.edit({
            id: req.params.id,
            res: res,
            schoolRequest: req.body,
        });

        res.json(school);
    }
);
