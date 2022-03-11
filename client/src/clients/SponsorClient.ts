import axios from "axios";
import { SponsorRecord, SponsorRequest } from "@nica-angels/shared";
import { getAuthHeader } from "jack-hermanson-ts-utils";

export abstract class SponsorClient {
    static baseUrl = "/api/sponsors";

    static async getAll(token: string) {
        const response = await axios.get<SponsorRecord[]>(
            this.baseUrl,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async getOne(id: number, token: string) {
        const response = await axios.get<SponsorRecord>(
            `${this.baseUrl}/${id}`,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async create(sponsorRequest: SponsorRequest, token: string) {
        const response = await axios.post<SponsorRecord>(
            this.baseUrl,
            sponsorRequest,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async update({
        id,
        sponsorRequest,
        token,
    }: {
        id: number;
        sponsorRequest: SponsorRequest;
        token: string;
    }) {
        const response = await axios.put<SponsorRecord>(
            `${this.baseUrl}/${id}`,
            sponsorRequest,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async delete(id: number, token: string) {
        const response = await axios.delete<boolean>(
            `${this.baseUrl}/${id}`,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async getCount(token: string) {
        const response = await axios.get<number>(
            `${this.baseUrl}/count`,
            getAuthHeader(token)
        );
        return response.data;
    }
}
