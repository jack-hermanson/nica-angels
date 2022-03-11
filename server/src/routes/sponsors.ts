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
    if (
        !authorized({
            requestingAccount: req.account,
            minClearance: Clearance.ADMIN,
            res,
        })
    ) {
        return;
    }
    const sponsors = await SponsorService.getAll();
    res.json(sponsors);
});

// get count
router.get("/count", auth, async (req: Request<any>, res: Response<number>) => {
    if (
        !authorized({
            requestingAccount: req.account,
            minClearance: Clearance.SPONSOR,
            res,
        })
    ) {
        return;
    }

    const count = await SponsorService.getCount();
    res.json(count);
});

// get one
router.get(
    "/:id",
    auth,
    async (req: Request<{ id: string }>, res: Response<SponsorRecord>) => {
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.ADMIN,
                res,
            })
        ) {
            return;
        }
        try {
            const id = parseNumber(req.params.id);
            logger.info(`GET /sponsors/${id}`);
            const sponsor = await SponsorService.getOne(id, res);
            if (!sponsor) {
                return;
            }
            res.json(sponsor);
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
            logger.fatal("Schema not valid");
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
router.put(
    "/:id",
    auth,
    async (
        req: Request<SponsorRequest & { id: string }>,
        res: Response<SponsorRecord>
    ) => {
        try {
            const id = parseNumber(req.params.id);
            logger.info(`PUT /sponsors/${id}`);
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
                logger.fatal("Schema not valid");
                return;
            }

            const updatedSponsor = await SponsorService.edit(id, req.body, res);
            if (!updatedSponsor) {
                return;
            }
            res.json(updatedSponsor);
        } catch (error) {
            logger.fatal(error);
            res.sendStatus(HTTP.SERVER_ERROR);
        }
    }
);

// delete
router.delete(
    "/:id",
    auth,
    async (req: Request<{ id: string }>, res: Response<boolean>) => {
        const id = parseNumber(req.params.id);
        logger.info(`DELETE /sponsors/${id}`);
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.ADMIN,
                res,
            })
        ) {
            return;
        }

        const deleted = await SponsorService.delete(id, res);
        if (!deleted) {
            return;
        }
        res.send(true);
    }
);
