import { getConnection, Repository } from "typeorm";
import { School } from "../models/School";
import { SchoolRequest } from "../../../shared/resource_models/school";
import { Response } from "express";
import { doesNotConflict, HTTP } from "jack-hermanson-ts-utils";
import { TownService } from "./TownService";

export abstract class SchoolService {
    static getRepos(): {
        schoolRepo: Repository<School>;
    } {
        const connection = getConnection();
        const schoolRepo = connection.getRepository(School);
        return {
            schoolRepo,
        };
    }

    /**
     * Checks if you are able to create a school with this name or if it has been taken.
     * @param schoolRequest
     * @param res
     * @param existingSchool
     */
    static async conflicts(
        schoolRequest: SchoolRequest,
        res: Response,
        existingSchool?: School
    ): Promise<boolean> {
        const { schoolRepo } = this.getRepos();

        return !(await doesNotConflict({
            res,
            repo: schoolRepo,
            properties: [
                {
                    name: "name",
                    value: schoolRequest.name,
                },
            ],
            existingRecord: existingSchool,
        }));
    }

    /**
     * Get all existing schools.
     */
    static async getAll(): Promise<School[]> {
        const { schoolRepo } = this.getRepos();
        return await schoolRepo.find();
    }

    /**
     * Create a new school.
     * @param schoolRequest
     * @param res
     */
    static async create(
        schoolRequest: SchoolRequest,
        res: Response
    ): Promise<School | undefined> {
        const { schoolRepo } = this.getRepos();

        if (await this.conflicts(schoolRequest, res)) {
            return undefined;
        }

        const school = new School();
        school.name = schoolRequest.name;

        const town = await TownService.getOne(schoolRequest.townId, res);
        if (!town) {
            return undefined;
        }

        school.townId = schoolRequest.townId;

        return await schoolRepo.save(school);
    }

    /**
     * Get one school record.
     * @param id
     * @param res
     */
    static async getOne(
        id: number,
        res: Response
    ): Promise<School | undefined> {
        const { schoolRepo } = this.getRepos();
        const school = await schoolRepo.findOne(id);
        if (!school) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }
        return school;
    }

    static async edit({
        id,
        schoolRequest,
        res,
    }: {
        id: number;
        schoolRequest: SchoolRequest;
        res: Response;
    }): Promise<School | undefined> {
        const { schoolRepo } = this.getRepos();

        const school = await this.getOne(id, res);
        if (!school) {
            return undefined;
        }

        return await schoolRepo.save({
            ...school,
            ...schoolRequest,
        });
    }
}
