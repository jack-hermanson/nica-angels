import {
    AggregateRequest,
    DateResourceModel,
    Sex,
} from "jack-hermanson-ts-utils";

export interface StudentRequest {
    firstName: string;
    middleName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    sex: Sex;
    level: number;
    imageId?: number;
    uniform: boolean;
    backpack: boolean;
    shoes: boolean;
    supplies: boolean;
}

export interface StudentRecord extends StudentRequest, DateResourceModel {}

export interface GetStudentsRequest extends AggregateRequest {
    searchText: string;
    minLevel: number;
    maxLevel: number;
}
