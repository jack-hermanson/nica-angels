import { DateResourceModel } from "jack-hermanson-ts-utils";

export interface EnrollmentRequest {
    schoolId: number;
    studentId: number;
    startDate?: Date;
    endDate?: Date;
}

export interface EnrollmentRecord
    extends EnrollmentRequest,
        DateResourceModel {}

export interface SchoolEnrollmentStats {
    schoolId: number;
    grade0: number;
    grade1: number;
    grade2: number;
    grade3: number;
    grade4: number;
    grade5: number;
    grade6: number;
    grade7: number;
    grade8: number;
    other: number;
}
