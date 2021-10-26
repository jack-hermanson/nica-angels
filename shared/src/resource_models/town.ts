import { DateResourceModel } from "jack-hermanson-ts-utils";

export interface TownRequest {
    name: string;
}

export interface TownRecord extends DateResourceModel, TownRequest {}
