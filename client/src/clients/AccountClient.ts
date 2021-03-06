import {
    AccountRecord,
    AdminEditAccountRequest,
    EditAccountRequest,
    LoginRequest,
    LogOutRequest,
    PromoteRequest,
    RegisterRequest,
    TokenRecord,
} from "@nica-angels/shared";
import axios from "axios";
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

    static async getAccounts(token: string) {
        const response = await axios.get<AccountRecord[]>(
            this.baseUrl,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async getTokens(accountId: number, token: string) {
        const response = await axios.get<number>(
            `${this.baseUrl}/tokens/${accountId}`,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async adminUpdate(
        accountId: number,
        adminEditAccountRequest: AdminEditAccountRequest,
        token: string
    ) {
        const response = await axios.put<AccountRecord>(
            `${this.baseUrl}/admin/${accountId}`,
            adminEditAccountRequest,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async promoteClearance(
        accountId: number,
        promoteRequest: PromoteRequest,
        token: string
    ) {
        const response = await axios.put<AccountRecord>(
            `${this.baseUrl}/clearance/${accountId}`,
            promoteRequest,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async editMyAccount(
        editAccountRequest: EditAccountRequest,
        token: string
    ) {
        const response = await axios.put<AccountRecord>(
            `${this.baseUrl}/my-account`,
            editAccountRequest,
            getAuthHeader(token)
        );
        return response.data;
    }
}
