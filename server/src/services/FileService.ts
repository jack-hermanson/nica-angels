import { getConnection, Repository } from "typeorm";
import { Response } from "express";
import { HTTP } from "jack-hermanson-ts-utils";

export abstract class FileService {
    static getRepos(): {
        fileRepo: Repository<File>;
    } {
        const connection = getConnection();
        return {
            fileRepo: connection.getRepository(File),
        };
    }

    static async getAll(): Promise<File[]> {
        const { fileRepo } = this.getRepos();
        return await fileRepo.find();
    }

    static async getOne(id: number, res: Response): Promise<File | undefined> {
        const { fileRepo } = this.getRepos();

        const file = await fileRepo.findOne(id);
        if (!file) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        return file;
    }
}
