import { getConnection, Repository } from "typeorm";
import { Sponsor } from "../models/Sponsor";
import { Response } from "express";
import { logger } from "../utils/logger";
import { doesNotConflict, HTTP } from "jack-hermanson-ts-utils";
import { SponsorRequest } from "@nica-angels/shared";
import { AccountService } from "./AccountService";

export abstract class SponsorService {
    static getRepos(): {
        sponsorRepo: Repository<Sponsor>;
    } {
        const connection = getConnection();
        const sponsorRepo = connection.getRepository(Sponsor);
        return { sponsorRepo };
    }

    static async emailIsAvailable({
        newEmail,
        res,
        existingRecord,
    }: {
        newEmail: string;
        res: Response;
        existingRecord?: Sponsor;
    }): Promise<boolean> {
        const { sponsorRepo } = this.getRepos();
        const isOkay: boolean = await doesNotConflict({
            repo: sponsorRepo,
            properties: [
                {
                    name: "email",
                    value: newEmail,
                },
            ],
            res,
            existingRecord,
        });
        if (!isOkay) {
            logger.fatal(`A sponsor with the email ${newEmail} already exists`);
        }
        return isOkay;
    }

    static async create(
        sponsorRequest: SponsorRequest,
        res: Response
    ): Promise<Sponsor | undefined> {
        const { sponsorRepo } = this.getRepos();
        if (
            !(await this.emailIsAvailable({
                newEmail: sponsorRequest.email,
                res,
            }))
        ) {
            return undefined;
        }

        const sponsor = new Sponsor();
        if (!(await this.setSponsor(sponsor, sponsorRequest, res))) {
            return undefined;
        }

        return await sponsorRepo.save(sponsor);
    }

    static async edit(
        id: number,
        sponsorRequest: SponsorRequest,
        res: Response
    ): Promise<Sponsor | undefined> {
        logger.info(`Editing sponsor with ID ${id}`);
        const sponsor = await this.getOne(id, res);
        if (!sponsor) {
            return undefined;
        }

        if (
            !(await this.emailIsAvailable({
                newEmail: sponsorRequest.email,
                res,
                existingRecord: sponsor,
            }))
        ) {
            return undefined;
        }

        if (!(await this.setSponsor(sponsor, sponsorRequest, res))) {
            return undefined;
        }

        logger.info(`Updated sponsor with ID ${sponsor.id}`);
        logger.debug(sponsor);

        const { sponsorRepo } = this.getRepos();
        return await sponsorRepo.save(sponsor);
    }

    static async getOne(
        id: number,
        res: Response
    ): Promise<Sponsor | undefined> {
        const { sponsorRepo } = this.getRepos();
        logger.info(`Looking for sponsor with ID ${id}`);
        const sponsor = await sponsorRepo.findOne(id);
        if (!sponsor) {
            res.sendStatus(HTTP.NOT_FOUND);
            logger.error(`Sponsor with ID ${id} not found`);
            return undefined;
        }
        return sponsor;
    }

    static async getAll(): Promise<Sponsor[]> {
        const { sponsorRepo } = this.getRepos();
        logger.info("Getting all sponsors");
        const sponsorQuery = sponsorRepo
            .createQueryBuilder("sponsor")
            .orderBy("sponsor.lastName");
        logger.debug(sponsorQuery.getSql());
        return await sponsorQuery.getMany();
    }

    static async delete(
        id: number,
        res: Response
    ): Promise<boolean | undefined> {
        logger.info(`Deleting sponsor with ID ${id}`);

        const sponsor = await this.getOne(id, res);
        if (!sponsor) {
            return undefined;
        }
        // todo: add cascade delete for Sponsorships and any other related models
        const { sponsorRepo } = this.getRepos();
        await sponsorRepo.softDelete(id);
        return true;
    }

    private static async setSponsor(
        sponsor: Sponsor,
        sponsorRequest: SponsorRequest,
        res: Response
    ): Promise<Sponsor | undefined> {
        sponsor.email = sponsorRequest.email;
        sponsor.firstName = sponsorRequest.firstName;
        sponsor.lastName = sponsorRequest.lastName;

        if (
            sponsorRequest.accountId &&
            !(await AccountService.getOne(sponsorRequest.accountId, res))
        ) {
            logger.fatal(
                `There is no account with ID ${sponsorRequest.accountId}`
            );
            return undefined;
        }

        sponsor.accountId = sponsorRequest.accountId;
        return sponsor;
    }
}
