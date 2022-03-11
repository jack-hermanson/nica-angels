import { getConnection, Repository } from "typeorm";
import { Payment } from "../models/Payment";
import { Response } from "express";
import { HTTP } from "jack-hermanson-ts-utils";
import { logger } from "../utils/logger";
import { SponsorshipService } from "./SponsorshipService";

export abstract class PaymentService {
    static getRepos(): {
        paymentRepo: Repository<Payment>;
    } {
        const paymentRepo = getConnection().getRepository(Payment);
        return {
            paymentRepo,
        };
    }

    static async getAll(): Promise<Payment[]> {
        logger.debug("Getting all payments.");
        const { paymentRepo } = this.getRepos();
        return await paymentRepo.find({ order: { created: "DESC" } });
    }

    static async getOne(
        id: number,
        res: Response
    ): Promise<Payment | undefined> {
        logger.debug(`Getting payment with ID ${id}.`);
        const { paymentRepo } = this.getRepos();
        const payment = await paymentRepo.findOne(id);

        if (!payment) {
            logger.fatal(`Payment with ID ${id} does not exist.`);
            res.sendStatus(HTTP.NOT_FOUND);
        }

        return payment;
    }

    /**
     * Get all the payments made by a particular sponsor, across all sponsorships.
     * Not to be confused with {@link getManyFromSponsorshipId}.
     * @param sponsorId
     */
    static async getManyFromSponsorId(sponsorId: number): Promise<Payment[]> {
        logger.debug(
            `Getting all payments made by sponsor with ID ${sponsorId}.`
        );
        const { paymentRepo } = this.getRepos();

        // all the sponsorships associated with this sponsor
        const sponsorships = await SponsorshipService.getManyFromSponsorId(
            sponsorId
        );

        // add found payments to this array
        const payments: Payment[] = [];

        // loop through each sponsorship
        for (let sponsorship of sponsorships) {
            const sponsorshipPayments = await paymentRepo.find({
                where: {
                    sponsorshipId: sponsorship.id,
                },
                order: {
                    created: "DESC",
                },
            });
            payments.push(...sponsorshipPayments);
        }

        logger.info(
            `Found ${payments.length} payments from ${sponsorships.length} sponsorships for sponsor with ID ${sponsorId}`
        );

        return payments;
    }

    /**
     * Get all the payments associated with a specific sponsorship.
     * Not to be confused with {@link getManyFromSponsorId}.
     * @param sponsorshipId
     */
    static async getManyFromSponsorshipId(
        sponsorshipId: number
    ): Promise<Payment[]> {
        logger.debug(
            `Getting all payments associated with sponsorship with ID ${sponsorshipId}.`
        );
        const { paymentRepo } = this.getRepos();
        return await paymentRepo.find({
            where: {
                sponsorshipId,
            },
            order: {
                created: "DESC",
            },
        });
    }
}
