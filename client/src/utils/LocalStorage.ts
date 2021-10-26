import { TokenRecord } from "../../../shared";

export abstract class LocalStorage {
    private static tokenKey = "token";
    private static redirectKey = "redirectPath";

    static saveToken(token: TokenRecord): void {
        localStorage.setItem(this.tokenKey, JSON.stringify(token));
    }

    static getToken(): TokenRecord | undefined {
        const token = localStorage.getItem(this.tokenKey);
        if (token) {
            return JSON.parse(token) as TokenRecord;
        }
        return undefined;
    }

    static removeToken(): void {
        localStorage.removeItem(this.tokenKey);
    }

    static getRedirectPath(): string | undefined {
        const redirectPath = localStorage.getItem(this.redirectKey);
        if (redirectPath) {
            return redirectPath;
        }
        return undefined;
    }

    static saveRedirectPath(path: string) {
        localStorage.setItem(this.redirectKey, path);
    }

    static removeRedirectPath(): void {
        localStorage.removeItem(this.redirectKey);
    }
}
