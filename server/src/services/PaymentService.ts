import { getConnection, Repository } from "typeorm";
import { Payment } from "../models/Payment";
import { Response } from "express";
import { HTTP } from "jack-hermanson-ts-utils";
import { logger } from "../utils/logger";
import { SponsorshipService } from "./SponsorshipService";
import { PaymentRequest } from "@nica-angels/shared";

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
        return await paymentRepo.find({ order: { updated: "DESC" } });
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

    static async create(
        paymentRequest: PaymentRequest,
        res: Response
    ): Promise<Payment | undefined> {
        logger.debug("Creating a new payment.");
        const { paymentRepo } = this.getRepos();

        const payment = new Payment();
        if (!(await this.setPayment(paymentRequest, payment, res))) {
            return undefined;
        }

        await paymentRepo.save(payment);
        logger.info(`Saved a new payment with ID ${payment.id}.`);
        logger.debug(payment);

        return payment;
    }

    static async edit(
        id: number,
        paymentRequest: PaymentRequest,
        res: Response
    ): Promise<Payment | undefined> {
        logger.debug(`Editing payment with ID ${id}.`);
        const { paymentRepo } = this.getRepos();

        const payment = await this.getOne(id, res);
        if (!payment) {
            return undefined;
        }

        if (!(await this.setPayment(paymentRequest, payment, res))) {
            return undefined;
        }

        await paymentRepo.save(payment);
        logger.info(`Edited payment with ID ${payment.id}.`);
        logger.debug(payment);

        return payment;
    }

    /**
     * Set the properties of a {@link Payment} / modify by reference.
     * To save the changes, use the repository.
     * @param paymentRequest
     * @param payment
     * @param res
     * @private
     */
    private static async setPayment(
        paymentRequest: PaymentRequest,
        payment: Payment,
        res: Response
    ): Promise<Payment | undefined> {
        const sponsorship = await SponsorshipService.getOne(
            paymentRequest.sponsorshipId,
            res
        );
        if (!sponsorship) {
            return undefined;
        }

        payment.amount = paymentRequest.amount;
        payment.paymentMethod = paymentRequest.paymentMethod;
        payment.notes = paymentRequest.notes || null;
        payment.sponsorshipId = sponsorship.id;
        payment.referenceNumber = paymentRequest.referenceNumber || null;

        return payment;
    }

    static async delete(id: number, res: Response): Promise<boolean> {
        logger.info(`Deleting payment with ID ${id}.`);
        const payment = await this.getOne(id, res);
        if (!payment) {
            return undefined;
        }

        const { paymentRepo } = this.getRepos();
        await paymentRepo.softRemove(payment);
        return true;
    }
}
