import {
    AggregateRequest,
    DateResourceModel,
    Sex,
} from "jack-hermanson-ts-utils";
import * as moment from "moment";

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
    schoolId?: number;
}

export interface StudentRecord extends StudentRequest, DateResourceModel {}

export interface GetStudentsRequest extends AggregateRequest {
    searchText: string;
    minLevel: number;
    maxLevel: number;
}

export function sexToString(sex: Sex, spanish: boolean = false): string {
    let output = "";
    switch (sex) {
        case Sex.FEMALE:
            output += spanish ? "Mujer" : "Female";
            output += " ♀";
            break;
        case Sex.MALE:
            output += spanish ? "Varón" : "Male";
            output += " ♂";
            break;
        default:
            throw new Error("Not male or female!");
    }

    return output;
}

export function getAge(student: StudentRecord): number | undefined {
    if (!student.dateOfBirth) {
        return undefined;
    }

    return moment().diff(moment(student.dateOfBirth), "years");
}

export function getIdPadded(student: StudentRecord, padding: number) {
    return String(student.id).padStart(padding, "0");
}
