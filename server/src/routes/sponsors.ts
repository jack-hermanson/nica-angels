import { Router, Request, Response } from "express";
import { logger } from "../utils/logger";
import { auth } from "../middleware/auth";
import { HTTP } from "jack-hermanson-ts-utils";
import { parseNumber } from "../utils/functions";
import { SponsorService } from "../services/SponsorService";

export const router = Router();

// get all
router.get("/", auth, async (req: Request, res: Response) => {
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
router.post("/", auth, async (req: Request, res: Response) => {
    logger.info("POST /sponsors");
});

// edit
router.put("/:id", auth, async (req: Request, res: Response) => {
    try {
        const id = parseNumber(req.params.id);
        logger.info(`PUT /sponsors/${id}`);
    } catch (error) {
        logger.fatal(error);
        res.sendStatus(HTTP.SERVER_ERROR);
    }
});
