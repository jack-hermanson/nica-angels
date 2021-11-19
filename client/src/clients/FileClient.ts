import { FileRecord, FileRequest } from "../../../shared";
import axios from "axios";
import { getAuthHeader } from "jack-hermanson-ts-utils";

export abstract class FileClient {
    static baseUrl = "/api/files";

    static async create(fileRequest: FileRequest, token: string) {
        const response = await axios.post<FileRecord>(
            this.baseUrl,
            fileRequest,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async getOne(id: number, token: string) {
        const response = await axios.get<FileRecord>(
            `${this.baseUrl}/${id}`,
            getAuthHeader(token)
        );
        return response.data;
    }
}
