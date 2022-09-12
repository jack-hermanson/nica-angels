import { getConnection, Repository } from "typeorm";
import { Sponsorship } from "../models/Sponsorship";
import { Response } from "express";
import { HTTP } from "jack-hermanson-ts-utils";
import {
    ExpandedSponsorshipRecord,
    SponsorshipRequest,
} from "@nica-angels/shared";
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
            logger.fatal(`No sponsorship with ${id} found.`);
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
        logger.info("Saving new sponsorship:", sponsorship);
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

        logger.info("Successfully edited sponsorship:", sponsorship);

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

    static async deleteFromSponsor(sponsorId: number): Promise<boolean> {
        const { sponsorshipRepo } = this.getRepos();

        const sponsorshipsWithSponsor = await sponsorshipRepo.find({
            sponsorId,
        });
        for (let sponsorship of sponsorshipsWithSponsor) {
            await sponsorshipRepo.softDelete(sponsorship);
        }
        return true;
    }

    static async getOneFromStudentId(
        studentId: number
    ): Promise<Sponsorship | undefined> {
        const { sponsorshipRepo } = this.getRepos();
        const query = sponsorshipRepo
            .createQueryBuilder("sponsorship")
            .where("sponsorship.endDate IS NULL")
            .andWhere(`sponsorship.studentId = ${studentId}`)
            .orderBy("sponsorship.startDate", "DESC");
        const allMatches = await query.getMany();
        switch (allMatches.length) {
            case 0:
                // logger.debug(
                //     `No current sponsorships for student with ID ${studentId}.`
                // );
                return undefined;
            case 1:
                // logger.debug(
                //     `1 current sponsorship for student with ID ${studentId}.`
                // );
                return allMatches[0];
            default:
                logger.fatal(
                    `More than 1 current sponsorship for student with ID ${studentId}.`
                );
                return allMatches[0];
        }
    }

    static async getManyFromSponsorId(
        sponsorId: number
    ): Promise<Sponsorship[]> {
        const { sponsorshipRepo } = this.getRepos();
        const query = sponsorshipRepo
            .createQueryBuilder("sponsorship")
            .where("sponsorship.endDate IS NULL")
            .andWhere(`sponsorship.sponsorId = ${sponsorId}`)
            .orderBy("sponsorship.startDate", "DESC");
        const allMatches = await query.getMany();
        logger.debug(
            `${allMatches.length} sponsorships for sponsor with ID ${sponsorId}.`
        );
        return allMatches;
    }

    static async getAverageDonation(): Promise<number> {
        const monthlyDonations: number[] = [];

        const sponsorships = await this.getAll();
        sponsorships.filter(s => s.endDate === undefined);

        if (sponsorships.length === 0) return 0;

        for (let sponsorship of sponsorships) {
            if (sponsorship.frequency === 1) {
                monthlyDonations.push(sponsorship.payment / 12);
            } else if (sponsorship.frequency === 4) {
                monthlyDonations.push(sponsorship.payment / 3);
            } else if (sponsorship.frequency === 12) {
                monthlyDonations.push(sponsorship.payment);
            }
        }

        const sum = monthlyDonations.reduce(
            (runningSum, amount) => runningSum + amount,
            0
        );

        return sum / monthlyDonations.length;
    }

    static async getExpandedSponsorships(
        { includeExpired }: { includeExpired: boolean } = {
            includeExpired: false,
        }
    ): Promise<ExpandedSponsorshipRecord[]> {
        const connection = getConnection();
        const rawRecords = await connection.query(
            this.generateExpandedSponsorshipQuery({
                includeExpired: includeExpired,
            })
        );

        return rawRecords.map(r => ({
            id: r.id,
            startDate: r.startDate,
            endDate: r.endDate,
            studentId: r.studentId,
            sponsorId: r.sponsorId,
            frequency: r.frequency,
            payment: r.payment,
            created: r.created,
            updated: r.updated,
            deleted: r.deleted,
            studentName: `${r.student_firstName} ${
                r.student_middleName ? `${r.student_middleName} ` : ""
            }${r.student_lastName || ""}`,
            sponsorName: `${r.sponsor_firstName} ${r.sponsor_lastName}`,
        }));
    }

    /**
     * Generates the raw SQL for selecting sponsorships in expanded (joined) form.
     * @param includeExpired - Whether to include sponsorships that have ended.
     */
    private static generateExpandedSponsorshipQuery(
        { includeExpired }: { includeExpired: boolean } = {
            includeExpired: false,
        }
    ): string {
        const select = `
            SELECT 
                "sponsorship"."id",
                "sponsorship"."startDate",
                "sponsorship"."endDate",
                "sponsorship"."studentId",
                "sponsorship"."sponsorId",
                "sponsorship"."frequency",
                "sponsorship"."payment",
                "sponsorship"."created",
                "sponsorship"."updated",
                "sponsorship"."deleted",
                "student"."firstName" as "student_firstName",
                "student"."middleName" as "student_middleName",
                "student"."lastName" as "student_lastName",
                "sponsor"."firstName" as "sponsor_firstName",
                "sponsor"."lastName" as "sponsor_lastName"
            FROM 
                sponsorship
            INNER JOIN
                student
            ON 
                "student"."id" = "sponsorship"."studentId"
            INNER JOIN
                sponsor
            ON 
                "sponsor"."id" = "sponsorship"."sponsorId"
        `;

        function generateWhere(): string {
            let output = `
                WHERE
                    (`;

            if (!includeExpired) {
                output += `
                    "sponsorship"."endDate" IS NULL
                AND`;
            }

            output += `
                "sponsorship"."deleted" IS NULL)
            ORDER BY "student_firstName" ASC;
            `;

            logger.debug(output);

            return output;
        }

        return select + generateWhere();
    }
}
