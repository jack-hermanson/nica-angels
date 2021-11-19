import { Response, Router } from "express";
import { auth } from "../middleware/auth";
import { authorized } from "../utils/functions";
import { Request } from "../utils/Request";
import { Clearance, FileRecord, FileRequest } from "../../../shared";
import { HTTP, validateRequest } from "jack-hermanson-ts-utils";
import { FileSchema } from "../models/File";
import { FileService } from "../services/FileService";

export const router = Router();

router.post(
    "/",
    auth,
    async (req: Request<FileRequest>, res: Response<FileRecord>) => {
        console.log("post file");

        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.SPONSOR,
                res,
            })
        ) {
            console.log("not authorized");
            return;
        }

        if (!(await validateRequest(FileSchema, req, res))) {
            console.log("not valid request");
            return;
        }

        try {
            console.log("before file service create");
            const file = await FileService.create(req.body);
            res.status(HTTP.CREATED).json(file);
        } catch (error) {
            res.status(HTTP.SERVER_ERROR).json(error);
        }
    }
);

router.get(
    "/",
    auth,
    async (req: Request<any>, res: Response<FileRecord[]>) => {
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.SPONSOR,
                res,
            })
        ) {
            return undefined;
        }

        const files = await FileService.getAll();
        res.json(files);
    }
);

router.get(
    "/:id",
    auth,
    async (req: Request<{ id: number }>, res: Response<FileRecord>) => {
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.SPONSOR,
                res,
            })
        ) {
            return undefined;
        }

        const file = await FileService.getOne(req.params.id, res);
        if (!file) {
            return;
        }
        res.json(file);
    }
);
