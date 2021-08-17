import express, { Response } from "express";
import { Request } from "../utils/Request";
import { AccountService } from "../services/AccountService";
import {
    AccountRecord,
    RegisterRequest,
} from "../../../shared/resource_models/account";
import { HTTP, sendError, validateRequest } from "jack-hermanson-ts-utils";
import { newAccountSchema } from "../models/Account";

export const router = express.Router();

// get accounts
router.get("/", async (req: Request<any>, res: Response) => {
    const accounts = await AccountService.getAccounts();
    res.json(accounts);
});

// register
router.post(
    "/register",
    async (req: Request<RegisterRequest>, res: Response<AccountRecord>) => {
        try {
            if (!(await validateRequest(newAccountSchema, req, res))) {
                return;
            }
            const registerRequest: RegisterRequest = req.body;
            const account = await AccountService.register(registerRequest, res);

            if (!account) {
                return;
            }

            delete account.password;

            res.status(HTTP.CREATED).json(account);
        } catch (error) {
            sendError(error, res);
        }
    }
);

router.delete(
    "/:id",
    async (req: Request<{ id: number }>, res: Response<boolean>) => {
        try {
            const deleted = await AccountService.delete(req.params.id, res);
            if (!deleted) {
                return;
            }
            res.send(true);
        } catch (error) {
            sendError(error, res);
        }
    }
);
