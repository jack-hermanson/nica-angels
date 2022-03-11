import { Router, Response } from "express";
import { auth } from "../middleware/auth";
import { Request } from "../utils/Request";
import { Clearance, PaymentRecord } from "@nica-angels/shared";
import { authorized } from "../utils/functions";
import { PaymentService } from "../services/PaymentService";
import { SponsorService } from "../services/SponsorService";
import { SponsorshipService } from "../services/SponsorshipService";

export const router = Router();

router.get(
    "/",
    auth,
    async (req: Request<any>, res: Response<PaymentRecord[]>) => {
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.ADMIN,
                res,
            })
        ) {
            return;
        }

        const payments = await PaymentService.getAll();
        res.json(payments);
    }
);

router.get(
    "/sponsor/:sponsorId",
    auth,
    async (
        req: Request<{ sponsorId: string }>,
        res: Response<PaymentRecord[]>
    ) => {
        const sponsorId = parseInt(req.params.sponsorId);

        const sponsor = await SponsorService.getOne(sponsorId, res);
        if (!sponsor) {
            return;
        }

        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.ADMIN,
                res,
                matchingAccountId: sponsor.accountId,
            })
        ) {
            return;
        }

        const payments = await PaymentService.getManyFromSponsorId(sponsorId);
        res.json(payments);
    }
);

router.get(
    "/sponsorship/:sponsorshipId",
    auth,
    async (
        req: Request<{ sponsorshipId: string }>,
        res: Response<PaymentRecord[]>
    ) => {
        const sponsorshipId = parseInt(req.params.sponsorshipId);

        const sponsorship = await SponsorshipService.getOne(sponsorshipId, res);
        if (!sponsorship) {
            return;
        }
        const sponsor = await SponsorService.getOne(sponsorship.sponsorId, res);
        if (!sponsor) {
            return;
        }

        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.ADMIN,
                res,
                matchingAccountId: sponsor.accountId,
            })
        ) {
            return;
        }

        const payments = await PaymentService.getManyFromSponsorshipId(
            sponsorshipId
        );
        res.json(payments);
    }
);

router.get(
    "/:id",
    auth,
    async (req: Request<{ id: string }>, res: Response<PaymentRecord>) => {
        const id = parseInt(req.params.id);

        const payment = await PaymentService.getOne(id, res);
        if (!payment) {
            return;
        }

        const sponsorship = await SponsorshipService.getOne(
            payment.sponsorshipId,
            res
        );
        if (!sponsorship) {
            return;
        }

        const sponsor = await SponsorService.getOne(sponsorship.sponsorId, res);
        if (!sponsor) {
            return undefined;
        }

        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.ADMIN,
                res,
                matchingAccountId: sponsor.accountId,
            })
        ) {
            return;
        }

        res.json(payment);
    }
);
