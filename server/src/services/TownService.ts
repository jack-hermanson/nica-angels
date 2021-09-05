import { TownRequest } from "../../../shared/resource_models/town";
import { Response } from "express";
import { Town } from "../models/Town";
import { getConnection, Repository } from "typeorm";
import { doesNotConflict } from "jack-hermanson-ts-utils";

export abstract class TownService {
    static getRepos(): {
        townRepo: Repository<Town>;
    } {
        const connection = getConnection();
        const townRepo = connection.getRepository(Town);
        return { townRepo };
    }

    static async create(
        townRequest: TownRequest,
        res: Response
    ): Promise<Town | undefined> {
        const { townRepo } = this.getRepos();

        if (
            !(await doesNotConflict({
                res,
                repo: townRepo,
                properties: [
                    {
                        name: "name",
                        value: townRequest.name,
                    },
                ],
            }))
        ) {
            return undefined;
        }

        const town = new Town();
        town.name = townRequest.name;

        return await townRepo.save(town);
    }
}
