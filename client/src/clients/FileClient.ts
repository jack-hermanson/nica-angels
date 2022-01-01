import {
    FileRecord,
    FileRequest,
    StudentImageRequest,
} from "@nica-angels/shared";
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

    static async getIds() {
        const response = await axios.get<number[]>(`${this.baseUrl}/ids`);
        return response.data;
    }

    static async delete(id: number, token: string) {
        try {
            const response = await axios.delete<boolean>(
                `${this.baseUrl}/${id}`,
                getAuthHeader(token)
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async uploadStudentImage(
        studentImageRequest: StudentImageRequest,
        token: string
    ) {
        try {
            const response = await axios.post<FileRecord>(
                `${this.baseUrl}/student-image`,
                studentImageRequest,
                getAuthHeader(token)
            );
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
