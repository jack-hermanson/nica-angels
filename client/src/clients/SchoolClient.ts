import { SchoolRecord, SchoolRequest } from "../../../shared";
import axios from "axios";
import { getAuthHeader } from "jack-hermanson-ts-utils";

export abstract class SchoolClient {
    static baseUrl = "/api/schools";

    static async createSchool(schoolRequest: SchoolRequest, token: string) {
        const response = await axios.post<SchoolRecord>(
            this.baseUrl,
            schoolRequest,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async getSchools(token: string) {
        const response = await axios.get<SchoolRecord[]>(
            this.baseUrl,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async getOneSchool(id: number, token: string) {
        const response = await axios.get<SchoolRecord>(
            `${this.baseUrl}/${id}`,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async editSchool({
        id,
        token,
        schoolRequest,
    }: {
        id: number;
        token: string;
        schoolRequest: SchoolRequest;
    }) {
        const response = await axios.put<SchoolRecord>(
            `${this.baseUrl}/${id}`,
            schoolRequest,
            getAuthHeader(token)
        );
        return response.data;
    }
}
