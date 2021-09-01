import {
    AccountRecord,
    RegisterRequest,
} from "../../../shared/resource_models/account";
import axios from "axios";

export abstract class AccountClient {
    static baseUrl = "/api/accounts";

    static async register(registerRequest: RegisterRequest) {
        const response = await axios.post<AccountRecord>(
            `${this.baseUrl}/register`,
            registerRequest
        );
        return response.data;
    }
}
