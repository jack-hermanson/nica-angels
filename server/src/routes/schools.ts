import express, { Response } from "express";
import { auth } from "../middleware/auth";
import { Request } from "../utils/Request";
import { SchoolRecord } from "../../../shared/resource_models/school";

export const router = express.Router();

router.get(
    "/",
    auth,
    async (request: Request<any>, response: Response<SchoolRecord[]>) => {}
);
