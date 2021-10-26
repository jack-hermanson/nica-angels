const millisecondsPerDay = 8.64e7;
export const tokenExpiration = 90 * millisecondsPerDay; // 30 days

export enum AuthError {
    EXPIRED = "Expired token",
    INVALID_ID = "Incorrect account ID in token",
    NONEXISTENT_TOKEN = "Token does not exist",
}
