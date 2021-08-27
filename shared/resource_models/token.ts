import { ResourceModel } from "jack-hermanson-ts-utils";

export interface TokenRecord extends ResourceModel {
    created: Date;
    accountId: number;
    data: string;
}

export interface TokenLoginRequest {
    data: string;
}

export interface LogOutRequest {
    token: string;
    logOutEverywhere: boolean;
}
