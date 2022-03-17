import axios from "axios";
import { getAuthHeader } from "jack-hermanson-ts-utils";
import fileDownload from "js-file-download";

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
}
