import axios from "axios";
import { SponsorshipRecord, SponsorshipRequest } from "@nica-angels/shared";
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
}
