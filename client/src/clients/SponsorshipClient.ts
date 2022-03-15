import axios from "axios";
import {
    ExpandedSponsorshipRecord,
    SponsorshipRecord,
    SponsorshipRequest,
} from "@nica-angels/shared";
import { getAuthHeader } from "jack-hermanson-ts-utils";

export abstract class SponsorshipClient {
    private static baseUrl = "/api/sponsorships";

    static async create(sponsorshipRequest: SponsorshipRequest, token: string) {
        const response = await axios.post<SponsorshipRecord>(
            this.baseUrl,
            sponsorshipRequest,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async edit(
        id: number,
        sponsorshipRequest: SponsorshipRequest,
        token: string
    ) {
        const response = await axios.put<SponsorshipRecord>(
            `${this.baseUrl}/${id}`,
            sponsorshipRequest,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async getAll(token: string) {
        const response = await axios.get<SponsorshipRecord[]>(
            this.baseUrl,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async getOne(id: number, token: string) {
        const response = await axios.get<SponsorshipRecord>(
            `${this.baseUrl}/${id}`,
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

    static async getOneFromStudentId(studentId: number, token: string) {
        const response = await axios.get<SponsorshipRecord | undefined>(
            `${this.baseUrl}/student/${studentId}`,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async getManyFromSponsorId(sponsorId: number, token: string) {
        const response = await axios.get<SponsorshipRecord[]>(
            `${this.baseUrl}/sponsor/${sponsorId}`,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async getAverageDonation(token: string) {
        const response = await axios.get<number>(
            `${this.baseUrl}/average-donation`,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async getExpandedSponsorships(token: string) {
        const response = await axios.get<ExpandedSponsorshipRecord[]>(
            `${this.baseUrl}/expanded`,
            getAuthHeader(token)
        );
        return response.data;
    }
}
