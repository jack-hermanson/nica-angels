import { AccountRecord, LoginRequest, RegisterRequest } from "../../../shared";
import axios from "axios";
import { LogOutRequest, TokenRecord } from "../../../shared";
import { getAuthHeader } from "jack-hermanson-ts-utils";

export abstract class AccountClient {
    static baseUrl = "/api/accounts";

    static async register(registerRequest: RegisterRequest) {
        const response = await axios.post<AccountRecord>(
            `${this.baseUrl}/register`,
            registerRequest
        );
        return response.data;
    }

    static async logIn(loginRequest: LoginRequest) {
        const response = await axios.post<TokenRecord>(
            `${this.baseUrl}/login`,
            loginRequest
        );
        return response.data;
    }

    static async getAccount(id: number, token: string) {
        const response = await axios.get<AccountRecord>(
            `${this.baseUrl}/${id}`,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async logOut(logOutRequest: LogOutRequest) {
        const response = await axios.post<boolean>(
            `${this.baseUrl}/logout`,
            logOutRequest,
            getAuthHeader(logOutRequest.token)
        );
        return response.data;
    }
}
