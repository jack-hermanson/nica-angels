import { StudentService } from "./StudentService";
import { getAge } from "@nica-angels/shared";
import { StudentSchoolSponsor } from "@nica-angels/shared";
import { getConnection } from "typeorm";
import moment from "moment";
import { SponsorshipService } from "./SponsorshipService";
import { Student } from "../models/Student";
import { SponsorService } from "./SponsorService";
import { EnrollmentService } from "./EnrollmentService";
import { Sponsor } from "../models/Sponsor";
import { School } from "../models/School";

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
}
