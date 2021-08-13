import express, { Response } from "express";
import { Request } from "../utils/Request";

export const router = express.Router();

// get accounts
router.get("/", async (req: Request<any>, res: Response) => {
    res.json({});
});
