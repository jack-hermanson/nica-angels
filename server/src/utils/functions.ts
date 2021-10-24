import { Account } from "../models/Account";
import { Response } from "express";
import { Clearance } from "../../../shared";
import { HTTP } from "jack-hermanson-ts-utils";

interface AuthorizedParameters {
    requestingAccount: Account;
    minClearance: Clearance;
    matchingAccountId?: number;
    res: Response;
}

/**
 * If the requesting user does not have sufficient clearance, it will send a 403
 * and return false.
 * If you pass in a matchingAccountId, it will return true if the requesting
 * account ID is the same as matchingAccountId.
 * @param requestingAccount - the account making the request
 * @param minClearance - the minimum clearance needed to proceed
 * @param matchingAccountId - the account to match IDs with (optional)
 * @param res - the response parameter from the route function
 */
export function authorized({
    requestingAccount,
    minClearance,
    matchingAccountId,
    res,
}: AuthorizedParameters): boolean {
    const meetsClearance = requestingAccount.clearance >= minClearance;
    if (!meetsClearance && matchingAccountId !== requestingAccount.id) {
        res.sendStatus(HTTP.FORBIDDEN);
        return false;
    }
    return true;
}
