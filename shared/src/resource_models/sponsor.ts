import { DateResourceModel } from "jack-hermanson-ts-utils";

export interface SponsorRequest {
    accountId?: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface SponsorRecord extends SponsorRequest, DateResourceModel {}
