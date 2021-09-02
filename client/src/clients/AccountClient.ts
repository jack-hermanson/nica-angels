import {
    AccountRecord,
    LoginRequest,
    RegisterRequest,
} from "../../../shared/resource_models/account";
import axios from "axios";
import { TokenRecord } from "../../../shared/resource_models/token";
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
}
