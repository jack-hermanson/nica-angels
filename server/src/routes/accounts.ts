import express, { Response } from "express";
import { Request } from "../utils/Request";
import { AccountService } from "../services/AccountService";

export const router = express.Router();

// get accounts
router.get("/", async (req: Request<any>, res: Response) => {
    const accounts = await AccountService.getAccounts();
    res.json(accounts);
});
