import { Account } from "../models/Account";
import { Response } from "express";
import { Clearance } from "../../../shared/enums";
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
    console.log("requestingAccount.clearance", requestingAccount.clearance);
    console.log(
        "typeof requestingAccount.clearance",
        typeof requestingAccount.clearance
    );
    console.log("minClearance", minClearance);
    console.log("typeof minClearance", typeof minClearance);
    console.log("matchingAccountId", matchingAccountId);
    console.log("typeof matchingAccountId", typeof matchingAccountId);
    console.log("requestingAccountId", requestingAccount.id);
    console.log("typeof requestingAccountId", typeof requestingAccount.id);
    if (!meetsClearance && matchingAccountId !== requestingAccount.id) {
        res.sendStatus(HTTP.FORBIDDEN);
        return false;
    }
    return true;
}
