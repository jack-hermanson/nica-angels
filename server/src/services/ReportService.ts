import { StudentService } from "./StudentService";
import { getAge, StudentSchoolSponsor } from "@nica-angels/shared";
import { getConnection } from "typeorm";
import { SponsorshipService } from "./SponsorshipService";
import { Student } from "../models/Student";
import { EnrollmentService } from "./EnrollmentService";
import { Sponsor } from "../models/Sponsor";
import { School } from "../models/School";
import { Sex } from "jack-hermanson-ts-utils";

export abstract class ReportService {
    /**
     * Returns a CSV string
     */
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

    static async getStudentSchoolSponsorReport(): Promise<
        StudentSchoolSponsor[]
    > {
        const results: StudentSchoolSponsor[] = [];

        const students = await getConnection()
            .getRepository(Student)
            .find({
                order: {
                    firstName: "ASC",
                },
            });

        for (let student of students) {
            const sponsorship = await SponsorshipService.getOneFromStudentId(
                student.id
            );
            const enrollment = await EnrollmentService.getCurrentEnrollment(
                student.id
            );

            let sponsorName: string | undefined;
            let schoolName: string | undefined;

            if (sponsorship) {
                const sponsor = await getConnection()
                    .getRepository(Sponsor)
                    .findOne(sponsorship.sponsorId);
                sponsorName = `${sponsor.firstName} ${sponsor.lastName}`;
            }

            if (enrollment) {
                const school = await getConnection()
                    .getRepository(School)
                    .findOne(enrollment.schoolId);
                schoolName = school.name;
            }

            results.push({
                student,
                schoolName,
                sponsorName,
            });
        }

        return results;
    }

    static async getStudentSchoolSponsorCsv(): Promise<string> {
        const array: StudentSchoolSponsor[] =
            await this.getStudentSchoolSponsorReport();
        let output =
            "ID, Student, School, Sponsor, Age, Level, Sex, Uniform, Backpack, Shoes, Supplies\n";

        for (let record of array) {
            let row = "";
            row += `${record.student.id}, `;
            row += `${record.student.firstName} ${
                record.student.middleName || ""
            } ${record.student.lastName || ""}, `;
            row += `${record.sponsorName || ""}, `;
            row += `${getAge(record.student) || ""}, `;
            row += `${record.student.level}, `;
            row += `${record.student.sex === Sex.MALE ? "Male" : "Female"}, `;
            row += `${record.student.uniform.toString()}, `;
            row += `${record.student.backpack.toString()}, `;
            row += `${record.student.shoes.toString()}, `;
            row += `${record.student.supplies.toString()}\n`;

            output += row;
        }

        return output;
    }
}
