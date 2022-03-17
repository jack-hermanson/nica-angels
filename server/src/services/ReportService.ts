import { StudentService } from "./StudentService";
import { getAge } from "@nica-angels/shared";

export abstract class ReportService {
    static async getStudentsWithoutSponsors(): Promise<string> {
        let output = "ID, First Name, Middle Name, Last Name, Level, Age\n";

        const students = await StudentService.getStudentsWithoutSponsors();

        for (let student of students) {
            const line = `${student.id}, ${student.firstName}, ${
                student.middleName || ""
            }, ${student.lastName || ""}, ${student.level}, ${
                getAge(student) || ""
            }`;
            output += line + "\n";
        }

        return output;
    }
}
