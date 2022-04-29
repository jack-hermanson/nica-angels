const millisecondsPerDay = 8.64e7;
const daysTillExpiration = 90;
export const tokenExpiration = daysTillExpiration * millisecondsPerDay; // 90 days

export enum AuthError {
    EXPIRED = "Expired token",
    INVALID_ID = "Incorrect account ID in token",
    NONEXISTENT_TOKEN = "Token does not exist",
}
