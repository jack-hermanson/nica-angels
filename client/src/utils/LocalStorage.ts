import { TokenRecord } from "../../../shared/resource_models/token";

export abstract class LocalStorage {
    private static keyName = "token";

    static saveToken(token: TokenRecord) {
        localStorage.setItem(this.keyName, JSON.stringify(token));
    }

    static getToken(): TokenRecord | undefined {
        const token = localStorage.getItem(this.keyName);
        if (token) {
            return JSON.parse(token) as TokenRecord;
        }
        return undefined;
    }

    static removeToken(): void {
        localStorage.removeItem(this.keyName);
    }
}
