import { getConnection, Repository } from "typeorm";
import { Sponsorship } from "../models/Sponsorship";
import { Response } from "express";
import { HTTP } from "jack-hermanson-ts-utils";
import { SponsorshipRequest } from "@nica-angels/shared";
import { StudentService } from "./StudentService";
import { SponsorService } from "./SponsorService";
import { logger } from "../utils/logger";

export abstract class SponsorshipService {
    static getRepos(): {
        sponsorshipRepo: Repository<Sponsorship>;
    } {
        const connection = getConnection();
        const sponsorshipRepo = connection.getRepository(Sponsorship);
        return {
            sponsorshipRepo,
        };
    }

    static async getAll(): Promise<Sponsorship[]> {
        const { sponsorshipRepo } = this.getRepos();
        return await sponsorshipRepo.find();
    }

    static async getOne(
        id: number,
        res: Response
    ): Promise<Sponsorship | undefined> {
        const { sponsorshipRepo } = this.getRepos();
        const sponsorship = await sponsorshipRepo.findOne(id);
        if (!sponsorship) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        return sponsorship;
    }

    static async create(
        sponsorshipRequest: SponsorshipRequest,
        res: Response
    ): Promise<Sponsorship | undefined> {
        const sponsorship = new Sponsorship();
        if (
            !(await this.setSponsorship(sponsorship, sponsorshipRequest, res))
        ) {
            return undefined;
        }

        const { sponsorshipRepo } = this.getRepos();
        logger.info("Saving new sponsorship:");
        logger.info(sponsorship);
        return await sponsorshipRepo.save(sponsorship);
    }

    static async edit(
        id: number,
        sponsorshipRequest: SponsorshipRequest,
        res: Response
    ): Promise<Sponsorship | undefined> {
        logger.info(`Editing sponsorship with ID ${id}`);

        const sponsorship = await this.getOne(id, res);
        if (!sponsorship) {
            return undefined;
        }

        if (
            !(await this.setSponsorship(sponsorship, sponsorshipRequest, res))
        ) {
            return undefined;
        }

        logger.info("Successfully edited sponsorship:");
        logger.info(sponsorship);

        const { sponsorshipRepo } = this.getRepos();
        return await sponsorshipRepo.save(sponsorship);
    }

    static async delete(
        id: number,
        res: Response
    ): Promise<boolean | undefined> {
        const sponsorship = await this.getOne(id, res);
        if (!sponsorship) {
            return undefined;
        }

        const { sponsorshipRepo } = this.getRepos();
        await sponsorshipRepo.softDelete(sponsorship);

        return true;
    }

    private static async setSponsorship(
        sponsorship: Sponsorship,
        sponsorshipRequest: SponsorshipRequest,
        res: Response
    ) {
        // set student
        const student = await StudentService.getOne(
            sponsorshipRequest.studentId,
            res
        );
        if (!student) {
            return undefined;
        }
        sponsorship.studentId = student.id;

        // set sponsor
        const sponsor = await SponsorService.getOne(
            sponsorshipRequest.sponsorId,
            res
        );
        if (!sponsor) {
            return undefined;
        }
        sponsorship.sponsorId = sponsor.id;

        // everything else
        sponsorship.startDate = sponsorshipRequest.startDate;
        sponsorship.endDate = sponsorshipRequest.endDate || null;
        sponsorship.payment = sponsorshipRequest.payment;
        sponsorship.frequency = sponsorshipRequest.frequency;

        return sponsorship;
    }
}
