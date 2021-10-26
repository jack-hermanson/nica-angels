import { ResourceModel } from "jack-hermanson-ts-utils";
import { tokenExpiration } from "../constants";

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

export function tokenHasExpired(token: TokenRecord): boolean {
    token.created = new Date(token.created);
    const expires = new Date(
        token.created.getTime() + tokenExpiration
    ).getTime();
    return expires < Date.now();
}
