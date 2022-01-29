import { Response, Router } from "express";
import { Request } from "../utils/Request";
import { logger } from "../utils/logger";
import { auth } from "../middleware/auth";
import { HTTP, validateRequest } from "jack-hermanson-ts-utils";
import { authorized, parseNumber } from "../utils/functions";
import { SponsorService } from "../services/SponsorService";
import { Clearance, SponsorRecord, SponsorRequest } from "@nica-angels/shared";
import { sponsorSchema } from "../models/Sponsor";

export const router = Router();

// get all
router.get("/", auth, async (req: Request<any>, res: Response) => {
    logger.debug("GET /sponsors");
    const sponsors = await SponsorService.getAll();
    res.json(sponsors);
});

// get one
router.get(
    "/:id",
    auth,
    async (req: Request<{ id: string }>, res: Response) => {
        try {
            const id = parseNumber(req.params.id);
            logger.info(`GET /sponsors/${id}`);
        } catch (error) {
            logger.fatal(error);
            res.sendStatus(HTTP.SERVER_ERROR);
        }
    }
);

// create new
router.post(
    "/",
    auth,
    async (req: Request<SponsorRequest>, res: Response<SponsorRecord>) => {
        logger.info("POST /sponsors");
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.ADMIN,
                res,
            })
        ) {
            return;
        }

        if (!(await validateRequest(sponsorSchema, req, res))) {
            return;
        }
        const sponsor = await SponsorService.create(req.body, res);
        if (!sponsor) {
            return;
        }

        res.status(HTTP.CREATED).json(sponsor);
    }
);

// edit
router.put("/:id", auth, async (req: Request<any>, res: Response) => {
    try {
        const id = parseNumber(req.params.id);
        logger.info(`PUT /sponsors/${id}`);
    } catch (error) {
        logger.fatal(error);
        res.sendStatus(HTTP.SERVER_ERROR);
    }
});
