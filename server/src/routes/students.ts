import { Router, Response } from "express";
import { Request } from "../utils/Request";
import { SchoolRecord } from "../../../shared/resource_models/school";

export const router = Router();

router.get("/", async (req: Request<any>, res: Response<SchoolRecord[]>) => {
    res.json();
});
