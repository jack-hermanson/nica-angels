import { FileRecord, FileRequest } from "../../../shared";
import axios from "axios";
import { getAuthHeader } from "jack-hermanson-ts-utils";

export abstract class FileClient {
    static baseUrl = "/api/files";

    static async create(fileRequest: FileRequest, token: string) {
        console.log("create file request client");
        const response = await axios.post<FileRecord>(
            this.baseUrl,
            fileRequest,
            getAuthHeader(token)
        );
        console.log("return response.data");
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
