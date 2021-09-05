import express, { Response } from "express";
import { Request } from "../utils/Request";
import { TownRecord, TownRequest } from "../../../shared/resource_models/town";
import { auth } from "../middleware/auth";
import { Clearance } from "../../../shared/enums";
import { HTTP, validateRequest } from "jack-hermanson-ts-utils";
import { townSchema } from "../models/Town";
import { TownService } from "../services/TownService";

export const router = express.Router();

router.post(
    "/",
    auth,
    async (req: Request<TownRequest>, res: Response<TownRecord>) => {
        if (req.account.clearance < Clearance.ADMIN) {
            res.sendStatus(HTTP.UNAUTHORIZED);
            return;
        }
        if (!(await validateRequest(townSchema, req, res))) {
            return;
        }

        const townRequest: TownRequest = req.body;
        const town = await TownService.create(townRequest, res);
        if (!town) {
            return;
        }
        res.status(HTTP.CREATED).json(town);
    }
);
