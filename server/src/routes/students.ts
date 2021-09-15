import { Router, Response } from "express";
import { Request } from "../utils/Request";
import { auth } from "../middleware/auth";
import { StudentService } from "../services/StudentService";
import { StudentRecord } from "../../../shared/resource_models/student";

export const router = Router();

router.get(
    "/",
    auth,
    async (req: Request<any>, res: Response<StudentRecord[]>) => {
        const students = await StudentService.getAll();
        res.json(students);
    }
);
