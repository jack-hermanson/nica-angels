import { Account } from "../models/Account";
import { Response } from "express";
import { getConnection, Repository } from "typeorm";
import { RegisterRequest } from "../../../shared/resource_models/account";
import { doesNotConflict } from "jack-hermanson-ts-utils";

const getRepos = (): {
    accountRepo: Repository<Account>;
} => {
    const connection = getConnection();
    const accountRepo = connection.getRepository(Account);
    return { accountRepo };
};

export abstract class AccountService {
    static async getAccounts(): Promise<Account[] | undefined> {
        const { accountRepo } = getRepos();
        return await accountRepo.find();
    }

    /**
     * Checks if the email that you are trying to use has already
     * been used.
     * @param email - the potential email to use, make sure it is lowercase
     * @param res - the response passed in from the caller
     * @param existingAccount - optional existing account, so you can keep the email the same
     */
    static async emailIsAvailable(
        email: string,
        res: Response,
        existingAccount?: Account
    ): Promise<boolean> {
        const { accountRepo } = getRepos();

        // check for existing email
        return await doesNotConflict({
            properties: [{ name: "email", value: email }],
            repo: accountRepo,
            res: res,
            existingRecord: existingAccount,
        });
    }

    static async register(
        registerRequest: RegisterRequest,
        res: Response
    ): Promise<Account | undefined> {
        console.log("register");
        const { accountRepo } = getRepos();

        // check for existing
        registerRequest.email = registerRequest.email.toLowerCase();
        if (!(await this.emailIsAvailable(registerRequest.email, res))) {
            return undefined;
        }

        const account = new Account();
        account.firstName = registerRequest.firstName;
        account.lastName = registerRequest.lastName;
        account.email = registerRequest.email;
        account.password = registerRequest.password;

        return await accountRepo.save(account);
    }
}
