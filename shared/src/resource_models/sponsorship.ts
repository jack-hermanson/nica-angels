import { DateResourceModel } from "jack-hermanson-ts-utils";

export interface SponsorshipRequest {
    studentId: number;
    sponsorId: number;
    startDate: Date;
    endDate?: Date;
    payment: number;
    frequency: number;
}

export interface SponsorshipRecord
    extends SponsorshipRequest,
        DateResourceModel {}
