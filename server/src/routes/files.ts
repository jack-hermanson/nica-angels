import { Request, Response, Router } from "express";
import { auth } from "../middleware/auth";

export const router = Router();

router.get("/", auth, async (req: Request, res: Response) => {});
