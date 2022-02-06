import express, { Response } from "express";
import { Request } from "../utils/Request";
import { AccountService } from "../services/AccountService";
import {
    AccountRecord,
    AdminEditAccountRequest,
    Clearance,
    EditAccountRequest,
    LoginRequest,
    LogOutRequest,
    PromoteRequest,
    RegisterRequest,
    TokenLoginRequest,
    TokenRecord,
} from "@nica-angels/shared";
import { HTTP, sendError, validateRequest } from "jack-hermanson-ts-utils";
import {
    adminEditAccountSchema,
    editMyAccountSchema,
    loginSchema,
    logoutSchema,
    newAccountSchema,
} from "../models/Account";
import { tokenLoginSchema } from "../models/Token";
import { auth } from "../middleware/auth";
import { authorized } from "../utils/functions";
import { logger } from "../utils/logger";

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

router.post(
    "/logout",
    auth,
    async (req: Request<LogOutRequest>, res: Response<boolean>) => {
        if (!(await validateRequest(logoutSchema, req, res))) {
            return;
        }
        const logOutRequest: LogOutRequest = req.body;
        const success = await AccountService.logOut(logOutRequest, res);
        if (!success) {
            return;
        }
        res.send(success);
    }
);

router.get(
    "/tokens/:accountId",
    auth,
    async (req: Request<{ accountId: string }>, res: Response) => {
        const accountId = parseInt(req.params.accountId);
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.ADMIN,
                matchingAccountId: accountId,
                res,
            })
        ) {
            return;
        }
        const tokens = await AccountService.countTokens(accountId);
        res.json(tokens);
    }
);

router.get(
    "/:id",
    auth,
    async (req: Request<{ id: string }>, res: Response<AccountRecord>) => {
        const accountId: number = parseInt(req.params.id);
        try {
            if (
                !authorized({
                    requestingAccount: req.account,
                    minClearance: Clearance.ADMIN,
                    matchingAccountId: accountId,
                    res,
                })
            ) {
                return;
            }
            const account = await AccountService.getOne(accountId, res);
            if (!account) {
                return;
            }
            delete account.password;
            res.json(account);
        } catch (error) {
            sendError(error, res);
        }
    }
);

router.put(
    "/admin/:id",
    auth,
    async (
        req: Request<AdminEditAccountRequest & { id: string }>,
        res: Response<AccountRecord | string>
    ) => {
        let accountId: number;
        try {
            accountId = parseInt(req.params.id);
        } catch (error) {
            console.error(error);
            return res
                .status(HTTP.SERVER_ERROR)
                .send(`Failed to parse account ID ${req.params.id}`);
        }

        if (!(await validateRequest(adminEditAccountSchema, req, res))) {
            return;
        }
        const adminEditAccountRequest: AdminEditAccountRequest = req.body;

        if (
            !authorized({
                requestingAccount: req.account,
                res,
                minClearance: Clearance.ADMIN,
            })
        ) {
            return;
        }

        const updatedAccount = await AccountService.adminUpdate(
            accountId,
            adminEditAccountRequest,
            res
        );
        if (!updatedAccount) {
            return;
        }

        res.json(updatedAccount);
    }
);

router.put(
    "/clearance/:id",
    auth,
    async (
        req: Request<PromoteRequest & { id: string }>,
        res: Response<AccountRecord>
    ) => {
        const id = parseInt(req.params.id);
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.SUPER_ADMIN,
                res,
            })
        ) {
            return;
        }

        const updatedAccount = await AccountService.promoteClearance(
            id,
            req.body
        );
        res.json(updatedAccount);
    }
);

router.put(
    "/my-account",
    auth,
    async (
        req: Request<EditAccountRequest>,
        res: Response<AccountRecord | undefined>
    ) => {
        logger.info(`User updating account:`);
        logger.info(req.account);

        if (!(await validateRequest(editMyAccountSchema, req, res))) {
            return;
        }

        const updatedAccount = await AccountService.updateOwnAccount(
            req.account.id,
            req.body,
            res
        );
        if (!updatedAccount) {
            return;
        }

        logger.info(`Account #${updatedAccount.id} updated successfully.`);
        res.json(updatedAccount);
    }
);
