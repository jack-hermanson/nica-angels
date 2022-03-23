import { StudentRecord } from "./student";

export interface StudentSchoolSponsor {
    student: StudentRecord;
    schoolName?: string;
    sponsorName?: string;
}
