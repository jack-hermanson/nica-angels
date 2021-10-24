import { Clearance } from "../enums";
import { DateResourceModel } from "jack-hermanson-ts-utils";

export interface AccountRecord
    extends DateResourceModel,
        Omit<RegisterRequest, "password"> {
    clearance: Clearance;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface EditAccountRequest extends Omit<RegisterRequest, "password"> {
    password?: string; // not required to change password
}

export interface AdminEditAccountRequest extends EditAccountRequest {
    clearance: Clearance;
}
