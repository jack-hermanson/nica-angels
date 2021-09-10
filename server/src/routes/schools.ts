import express, { Response } from "express";
import { auth } from "../middleware/auth";
import { Request } from "../utils/Request";
import {
    SchoolRecord,
    SchoolRequest,
} from "../../../shared/resource_models/school";
import { authorized } from "../utils/functions";
import { Clearance } from "../../../shared/enums";
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
