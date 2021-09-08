import { TownRequest } from "../../../shared/resource_models/town";
import { Response } from "express";
import { Town } from "../models/Town";
import { getConnection, Repository } from "typeorm";
import { doesNotConflict, HTTP } from "jack-hermanson-ts-utils";

export abstract class TownService {
    static getRepos(): {
        townRepo: Repository<Town>;
    } {
        const connection = getConnection();
        const townRepo = connection.getRepository(Town);
        return { townRepo };
    }

    /**
     * Checks if you are able to use this name or if it is taken.
     * @param townRequest
     * @param res
     * @param existingTown
     */
    static async conflicts(
        townRequest: TownRequest,
        res: Response,
        existingTown?: Town
    ): Promise<boolean> {
        const { townRepo } = this.getRepos();

        return !(await doesNotConflict({
            res,
            repo: townRepo,
            properties: [
                {
                    name: "name",
                    value: townRequest.name,
                },
            ],
            existingRecord: existingTown,
        }));
    }

    /**
     * Create a new town.
     * @param townRequest
     * @param res
     */
    static async create(
        townRequest: TownRequest,
        res: Response
    ): Promise<Town | undefined> {
        const { townRepo } = this.getRepos();

        if (await this.conflicts(townRequest, res)) {
            return undefined;
        }

        const town = new Town();
        town.name = townRequest.name;

        return await townRepo.save(town);
    }

    /**
     * Edit an existing town.
     * @param id
     * @param townRequest
     * @param res
     */
    static async edit(
        id: number,
        townRequest: TownRequest,
        res: Response
    ): Promise<Town | undefined> {
        const { townRepo } = this.getRepos();
        const existingTown = await townRepo.findOne(id);
        if (!existingTown) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        if (await this.conflicts(townRequest, res, existingTown)) {
            return undefined;
        }

        return await townRepo.save({
            ...existingTown,
            ...townRequest,
        });
    }

    /**
     * Get one specific town.
     * @param id
     * @param res
     */
    static async getOne(id: number, res: Response): Promise<Town | undefined> {
        const { townRepo } = this.getRepos();
        const town = await townRepo.findOne(id);
        if (!town) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }
        return town;
    }

    /**
     * Get all towns
     */
    static async getAll(): Promise<Town[]> {
        const { townRepo } = this.getRepos();
        return await townRepo.find();
    }
}
