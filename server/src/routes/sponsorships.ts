import { Response, Router } from "express";
import { Request } from "../utils/Request";
import { logger } from "../utils/logger";
import { auth } from "../middleware/auth";
import { HTTP, validateRequest } from "jack-hermanson-ts-utils";
import { authorized, parseNumber } from "../utils/functions";
import { SponsorshipService } from "../services/SponsorshipService";
import {
    Clearance,
    SponsorshipRecord,
    SponsorshipRequest,
} from "@nica-angels/shared";
import { sponsorshipSchema } from "../models/Sponsorship";

export const router = Router();

router.get(
    "/",
    auth,
    async (req: Request<any>, res: Response<SponsorshipRecord[]>) => {
        logger.debug("GET /sponsorships");

        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.ADMIN,
                res,
            })
        ) {
            return;
        }

        const sponsorships = await SponsorshipService.getAll();
        res.json(sponsorships);
    }
);

router.get(
    "/:id",
    auth,
    async (req: Request<{ id: string }>, res: Response<SponsorshipRecord>) => {
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
            logger.debug(`GET /sponsorships/${id}`);
            const sponsorship = await SponsorshipService.getOne(id, res);
            if (!sponsorship) {
                return;
            }
            res.json(sponsorship);
        } catch (error) {
            logger.fatal(error);
            res.status(HTTP.SERVER_ERROR).json(error);
        }
    }
);

router.post(
    "/",
    auth,
    async (
        req: Request<SponsorshipRequest>,
        res: Response<SponsorshipRecord>
    ) => {
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.ADMIN,
                res,
            })
        ) {
            return;
        }

        if (!(await validateRequest(sponsorshipSchema, req, res))) {
            logger.fatal("Schema not valid");
            return;
        }

        const sponsorship = await SponsorshipService.create(req.body, res);
        if (!sponsorship) {
            return;
        }

        res.status(HTTP.CREATED).json(sponsorship);
    }
);

router.put(
    "/:id",
    auth,
    async (
        req: Request<SponsorshipRequest & { id: string }>,
        res: Response<SponsorshipRecord>
    ) => {
        try {
            const id = parseNumber(req.params.id);
            if (
                !authorized({
                    requestingAccount: req.account,
                    minClearance: Clearance.ADMIN,
                    res,
                })
            ) {
                return;
            }

            if (!(await validateRequest(sponsorshipSchema, req, res))) {
                logger.fatal("Schema not valid");
                return;
            }

            const updatedSponsorship = await SponsorshipService.edit(
                id,
                req.body,
                res
            );
            if (!updatedSponsorship) {
                return;
            }

            res.json(updatedSponsorship);
        } catch (error) {
            logger.fatal(error);
            res.status(HTTP.SERVER_ERROR).json(error);
        }
    }
);

router.delete(
    "/:id",
    auth,
    async (req: Request<{ id: string }>, res: Response<boolean>) => {
        try {
            const id = parseNumber(req.params.id);
            logger.info(`DELETE /sponsorships/${id}`);
            if (
                !authorized({
                    requestingAccount: req.account,
                    minClearance: Clearance.ADMIN,
                    res,
                })
            ) {
                return;
            }

            const deleted = await SponsorshipService.delete(id, res);
            if (!deleted) {
                return;
            }
            res.send(true);
        } catch (error) {
            logger.fatal(error);
            res.status(HTTP.SERVER_ERROR).json(error);
        }
    }
);
