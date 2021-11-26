import { getConnection, Repository } from "typeorm";
import { Response } from "express";
import { HTTP } from "jack-hermanson-ts-utils";
import { FileRequest } from "../../../shared";
import { File } from "../models/File";

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

    static async getIds(): Promise<number[]> {
        const { fileRepo } = this.getRepos();
        const query = fileRepo.createQueryBuilder("file");
        const files = await query.select(["file.id"]).getMany();
        return files.map(f => f.id);
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

    static async create(fileRequest: FileRequest): Promise<File> {
        const { fileRepo } = this.getRepos();

        return await fileRepo.save(fileRequest);
    }

    static async delete(
        id: number,
        res: Response
    ): Promise<boolean | undefined> {
        const { fileRepo } = this.getRepos();

        const file = await fileRepo.findOne(id);
        if (!file) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        await fileRepo.softDelete({ id: file.id });

        return true;
    }
}
