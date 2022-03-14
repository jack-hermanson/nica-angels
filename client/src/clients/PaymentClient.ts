import { PaymentRecord, PaymentRequest } from "@nica-angels/shared";
import axios from "axios";
import { getAuthHeader } from "jack-hermanson-ts-utils";

export abstract class PaymentClient {
    private static baseUrl = "/api/payments";

    static async getAll(token: string) {
        const response = await axios.get<PaymentRecord[]>(
            this.baseUrl,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async getOne(id: number, token: string) {
        const response = await axios.get<PaymentRecord>(
            `${this.baseUrl}/${id}`,
            getAuthHeader(token)
        );
        return response.data;
    }

    /**
     * Get all the payments made by a particular sponsor across
     * all sponsorships.
     * @param sponsorId - the sponsor's ID
     * @param token - the current user's JWT token
     */
    static async getManyFromSponsorId(sponsorId: number, token: string) {
        const response = await axios.get<PaymentRecord[]>(
            `${this.baseUrl}/sponsor/${sponsorId}`,
            getAuthHeader(token)
        );
        return response.data;
    }

    /**
     * Get all payments associated with a particular sponsorship.
     * @param sponsorshipId - the ID of the sponsorship
     * @param token - the current user's JWT token
     */
    static async getManyFromSponsorshipId(
        sponsorshipId: number,
        token: string
    ) {
        const response = await axios.get<PaymentRecord[]>(
            `${this.baseUrl}/sponsorship/${sponsorshipId}`,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async create(paymentRequest: PaymentRequest, token: string) {
        const response = await axios.post<PaymentRecord>(
            this.baseUrl,
            paymentRequest,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async edit(
        id: number,
        paymentRequest: PaymentRequest,
        token: string
    ) {
        const response = await axios.put<PaymentRecord>(
            `${this.baseUrl}/${id}`,
            paymentRequest,
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
}
