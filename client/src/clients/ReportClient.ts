import axios from "axios";
import { getAuthHeader } from "jack-hermanson-ts-utils";
import fileDownload from "js-file-download";
import {
    SchoolEnrollmentStats,
    StudentSchoolSponsor,
} from "@nica-angels/shared";

export abstract class ReportClient {
    private static baseUrl = "/api/reports";

    static async getStudentsWithoutSponsors(token: string) {
        const response = await axios.get(
            `${this.baseUrl}/students/no-sponsor`,
            getAuthHeader(token)
        );

        return fileDownload(
            response.data,
            "students-without-sponsors.csv",
            "text/csv"
        );
    }

    static async getStudentSchoolSponsorReport(token: string) {
        const response = await axios.get<StudentSchoolSponsor[]>(
            `${this.baseUrl}/students/school-and-sponsor`,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async getStudentSchoolSponsorCsv(token: string) {
        const response = await axios.get(
            `${this.baseUrl}/students/school-and-sponsor-csv`,
            getAuthHeader(token)
        );
        return fileDownload(
            response.data,
            "student-school-sponsor.csv",
            "text/csv"
        );
    }

    static async getStudentsPerGradeReport(token: string) {
        const response = await axios.get<SchoolEnrollmentStats[]>(
            `${this.baseUrl}/schools/students-per-grade`,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async getStudentsPerGradeReportCsv(token: string) {
        const response = await axios.get(
            `${this.baseUrl}/schools/students-per-grade-csv`,
            getAuthHeader(token)
        );
        return fileDownload(
            response.data,
            "students-per-grade.csv",
            "text/csv"
        );
    }
}
