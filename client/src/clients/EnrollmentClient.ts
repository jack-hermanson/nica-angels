import axios from "axios";
import {
    EnrollmentRecord,
    EnrollmentRequest,
} from "../../../shared/resource_models/enrollment";
import { getAuthHeader } from "jack-hermanson-ts-utils";

export abstract class EnrollmentClient {
    static baseUrl = "/api/enrollments";

    static async getEnrollments(token: string) {
        const response = await axios.get<EnrollmentRecord[]>(
            this.baseUrl,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async getEnrollment(id: number, token: string) {
        const response = await axios.get<EnrollmentRecord>(
            `${this.baseUrl}/${id}`,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async createEnrollment(
        enrollmentRequest: EnrollmentRequest,
        token: string
    ) {
        const response = await axios.post<EnrollmentRecord>(
            this.baseUrl,
            enrollmentRequest,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async updateEnrollment({
        id,
        enrollmentRequest,
        token,
    }: {
        id: number;
        enrollmentRequest: EnrollmentRequest;
        token: string;
    }) {
        const response = await axios.put(
            `${this.baseUrl}/${id}`,
            enrollmentRequest,
            getAuthHeader(token)
        );
        return response.data;
    }
}
