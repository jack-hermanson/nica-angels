import { DateResourceModel } from "jack-hermanson-ts-utils";

export interface SchoolRequest {
    name: string;
    townId: number;
}

export interface SchoolRecord extends DateResourceModel, SchoolRequest {}
