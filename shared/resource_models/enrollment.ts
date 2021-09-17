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
