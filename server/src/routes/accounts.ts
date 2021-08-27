import express, { Response } from "express";
import { Request } from "../utils/Request";
import { AccountService } from "../services/AccountService";
import {
    AccountRecord,
    LoginRequest,
    RegisterRequest,
} from "../../../shared/resource_models/account";
import { HTTP, sendError, validateRequest } from "jack-hermanson-ts-utils";
import { loginSchema, newAccountSchema } from "../models/Account";
import {
    TokenLoginRequest,
    TokenRecord,
} from "../../../shared/resource_models/token";
import { tokenLoginSchema } from "../models/Token";
import { auth } from "../middleware/auth";
import { authorized } from "../utils/functions";
import { Clearance } from "../../../shared/enums";

export const router = express.Router();

// get accounts
router.get("/", auth, async (req: Request<any>, res: Response) => {
    if (
        !authorized({
            requestingAccount: req.account,
            minClearance: Clearance.ADMIN,
            res: res,
        })
    ) {
        return;
    }

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
    auth,
    async (req: Request<{ id: number }>, res: Response<boolean>) => {
        try {
            if (
                !authorized({
                    requestingAccount: req.account,
                    minClearance: Clearance.ADMIN,
                    res: res,
                })
            ) {
                return;
            }
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

router.post(
    "/login",
    async (req: Request<LoginRequest>, res: Response<TokenRecord>) => {
        try {
            if (!(await validateRequest(loginSchema, req, res))) {
                return;
            }
            const loginRequest: LoginRequest = req.body;
            const token = await AccountService.login(loginRequest, res);

            if (!token) {
                return;
            }

            res.json(token);
        } catch (error) {
            sendError(error, res);
        }
    }
);

router.post(
    "/token",
    async (req: Request<TokenLoginRequest>, res: Response<TokenRecord>) => {
        try {
            if (!(await validateRequest(tokenLoginSchema, req, res))) {
                return;
            }
            const tokenLoginRequest: TokenLoginRequest = req.body;
            const token = await AccountService.loginWithToken(
                tokenLoginRequest,
                res
            );
            if (!token) {
                return;
            }

            res.json(token);
        } catch (error) {
            sendError(error, res);
        }
    }
);
