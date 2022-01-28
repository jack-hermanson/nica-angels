import { getConnection, Repository } from "typeorm";
import { Sponsor } from "../models/Sponsor";
import { Response } from "express";
import { logger } from "../utils/logger";
import { HTTP } from "jack-hermanson-ts-utils";

export abstract class SponsorService {
    static getRepos(): {
        sponsorRepo: Repository<Sponsor>;
    } {
        const connection = getConnection();
        const sponsorRepo = connection.getRepository(Sponsor);
        return { sponsorRepo };
    }

    static async create() {}

    static async edit(id: number, res: Response): Promise<Sponsor | undefined> {
        logger.info(`Editing sponsor with ID ${id}`);
        const sponsor = await this.getOne(id, res);
        if (!sponsor) {
            return undefined;
        }
        // todo edit sponsor
        return sponsor;
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
        logger.info(sponsorQuery.getSql());
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
}
