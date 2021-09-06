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
}
