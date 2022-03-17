import { Response, Router } from "express";
import { Request } from "../utils/Request";
import { auth } from "../middleware/auth";
import { authorized } from "../utils/functions";
import { Clearance } from "@nica-angels/shared";

export const router = Router();

router.get(
    "/students/no-sponsor",
    auth,
    async (req: Request<any>, res: Response) => {
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.ADMIN,
                res,
            })
        ) {
            return undefined;
        }
    }
);
