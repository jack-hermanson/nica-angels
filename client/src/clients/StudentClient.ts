import axios from "axios";
import {
    StudentRecord,
    StudentRequest,
} from "../../../shared/resource_models/student";
import { getAuthHeader } from "jack-hermanson-ts-utils";

export abstract class StudentClient {
    static baseUrl = "/api/students";

    static async getStudents(token: string) {
        const students = await axios.get<StudentRecord[]>(
            this.baseUrl,
            getAuthHeader(token)
        );
        return students.data;
    }

    static async getStudent(id: number, token: string) {
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
}
