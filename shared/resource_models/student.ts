import { DateResourceModel, Sex } from "jack-hermanson-ts-utils";

export interface StudentRequest {
    firstName: string;
    nickName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    sex: Sex;
    level?: number;
    backpack: boolean;
    shoes: boolean;
    supplies: boolean;
}

export interface StudentRecord extends StudentRequest, DateResourceModel {}
