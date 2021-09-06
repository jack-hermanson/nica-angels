import express, { Response } from "express";
import { Request } from "../utils/Request";
import { TownRecord, TownRequest } from "../../../shared/resource_models/town";
import { auth } from "../middleware/auth";
import { Clearance } from "../../../shared/enums";
import { HTTP, validateRequest } from "jack-hermanson-ts-utils";
import { townSchema } from "../models/Town";
import { TownService } from "../services/TownService";
import { AccountService } from "../services/AccountService";

export const router = express.Router();

router.post(
    "/",
    auth,
    async (req: Request<TownRequest>, res: Response<TownRecord>) => {
        if (
            !(await AccountService.hasMinClearance(
                req.account,
                Clearance.ADMIN,
                res
            ))
        ) {
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

router.put(
    "/:id",
    auth,
    async (
        req: Request<{ id: number } & TownRequest>,
        res: Response<TownRecord>
    ) => {
        if (
            !(await AccountService.hasMinClearance(
                req.account,
                Clearance.ADMIN,
                res
            ))
        ) {
            return;
        }

        if (!(await validateRequest(townSchema, req, res))) {
            return;
        }
        const townRequest: TownRequest = req.body;

        const editedTown = await TownService.edit(
            req.params.id,
            townRequest,
            res
        );
        if (!editedTown) {
            return;
        }

        res.json(editedTown);
    }
);
