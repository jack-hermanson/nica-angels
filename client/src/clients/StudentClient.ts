import axios from "axios";
import {
    GetStudentsRequest,
    StudentRecord,
    StudentRequest,
} from "@nica-angels/shared";
import { AggregateResourceModel, getAuthHeader } from "jack-hermanson-ts-utils";

export abstract class StudentClient {
    static baseUrl = "/api/students";

    static async getStudents(
        getStudentsRequest: GetStudentsRequest,
        token: string
    ) {
        console.log(getStudentsRequest);
        const headers = {
            ...getAuthHeader(token),
            params: {
                skip: getStudentsRequest.skip,
                take: getStudentsRequest.take,
                searchText: getStudentsRequest.searchText,
                minLevel: getStudentsRequest.minLevel,
                maxLevel: getStudentsRequest.maxLevel,
            },
        };
        const students = await axios.get<AggregateResourceModel<StudentRecord>>(
            this.baseUrl,
            headers
        );
        return students.data;
    }

    static async getOne(id: number, token: string) {
        const student = await axios.get<StudentRecord>(
            `${this.baseUrl}/${id}`,
            getAuthHeader(token)
        );
        return student.data;
    }

    static async createStudent(studentRequest: StudentRequest, token: string) {
        const student = await axios.post<StudentRecord>(
            this.baseUrl,
            studentRequest,
            getAuthHeader(token)
        );
        return student.data;
    }

    static async editStudent({
        id,
        studentRequest,
        token,
    }: {
        id: number;
        studentRequest: StudentRequest;
        token: string;
    }) {
        const student = await axios.put<StudentRecord>(
            `${this.baseUrl}/${id}`,
            studentRequest,
            getAuthHeader(token)
        );
        return student.data;
    }

    static async getCount(token: string) {
        const response = await axios.get<number>(
            `${this.baseUrl}/count`,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async getWithoutSponsors(token: string) {
        const response = await axios.get<StudentRecord[]>(
            `${this.baseUrl}/no-sponsor`,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async graduate(token: string) {
        const response = await axios.post<boolean>(
            `${this.baseUrl}/graduate`,
            undefined,
            getAuthHeader(token)
        );
        return response.data;
    }
}
