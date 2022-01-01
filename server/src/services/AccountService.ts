import { Account } from "../models/Account";
import { Response } from "express";
import { getConnection, Repository } from "typeorm";
import {
    AdminEditAccountRequest,
    Clearance,
    LoginRequest,
    LogOutRequest,
    RegisterRequest,
    TokenLoginRequest,
} from "@nica-angels/shared";
import { doesNotConflict, HTTP } from "jack-hermanson-ts-utils";
import { Token } from "../models/Token";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const getRepos = (): {
    accountRepo: Repository<Account>;
    tokenRepo: Repository<Token>;
} => {
    const connection = getConnection();
    const accountRepo = connection.getRepository(Account);
    const tokenRepo = connection.getRepository(Token);
    return { accountRepo, tokenRepo };
};

export abstract class AccountService {
    static async getAccounts(): Promise<Account[] | undefined> {
        const { accountRepo } = getRepos();
        const accounts = await accountRepo.find();
        return accounts.map(account => {
            delete account.password;
            return account;
        });
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

        account.password = await AccountService.hashPassword(
            registerRequest.password
        );

        return await accountRepo.save(account);
    }

    static async hashPassword(plainText: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(plainText, salt);
    }

    static async delete(
        id: number,
        res: Response
    ): Promise<boolean | undefined> {
        const { accountRepo } = getRepos();

        const account = await accountRepo.findOne(id);
        if (!account) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        await accountRepo.softDelete({ id: account.id });

        return true;
    }

    static async login(
        loginRequest: LoginRequest,
        res: Response
    ): Promise<Token | undefined> {
        const { accountRepo, tokenRepo } = getRepos();

        const account = await accountRepo.findOne({
            email: loginRequest.email,
        });
        if (!account) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        const validPassword: boolean = await bcrypt.compare(
            loginRequest.password,
            account.password
        );
        if (!validPassword) {
            res.status(HTTP.BAD_REQUEST).send("Wrong password.");
            return undefined;
        }

        const tokenData = jwt.sign({ id: account.id }, process.env.SECRET_KEY);
        const token = new Token();
        token.accountId = account.id;
        token.data = tokenData;
        return await tokenRepo.save(token);
    }

    static async loginWithToken(
        tokenLoginRequest: TokenLoginRequest,
        res: Response
    ): Promise<Token | undefined> {
        const { accountRepo, tokenRepo } = getRepos();

        const token = await tokenRepo.findOne({ data: tokenLoginRequest.data });
        if (!token) {
            res.status(HTTP.NOT_FOUND).send(
                "That token does not exist or has expired. Please log in again."
            );
        }

        const account = await accountRepo.findOne(token.accountId);
        if (!account) {
            // this should never happen, but just in case...
            res.status(HTTP.NOT_FOUND).send("That account does not exist.");
        }

        return token;
    }

    static async logOut(
        logOutRequest: LogOutRequest,
        res: Response
    ): Promise<boolean | undefined> {
        const { tokenRepo } = getRepos();

        const token = await tokenRepo.findOne({ data: logOutRequest.token });
        if (!token) {
            res.status(HTTP.NOT_FOUND).send("That token does not exist.");
            return undefined;
        }

        const tokens: Token[] = [token];

        if (logOutRequest.logOutEverywhere) {
            const userTokens = await tokenRepo.find({
                accountId: token.accountId,
            });
            for (let userToken of userTokens) {
                if (userToken !== token) {
                    tokens.push(userToken);
                }
            }
        }

        for (let token of tokens) {
            await tokenRepo.remove(token);
        }

        return true;
    }

    /**
     * Get a single account.
     * @param id
     * @param res
     */
    static async getOne(
        id: number,
        res: Response
    ): Promise<Account | undefined> {
        const { accountRepo } = getRepos();
        const account = await accountRepo.findOne(id);
        if (!account) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }
        return account;
    }

    /**
     * Makes sure the user has the right clearance level.
     * @param account
     * @param clearance
     * @param res
     */
    static async hasMinClearance(
        account: Account,
        clearance: Clearance,
        res: Response
    ): Promise<boolean> {
        if (account.clearance < clearance) {
            res.sendStatus(HTTP.UNAUTHORIZED);
            return false;
        }
        return true;
    }

    /**
     * Admin is updating another user's (or their own) account.
     * Don't use for promoting another user to admin.
     * @param accountId - the ID of the account you are modifying
     * @param editAccountRequest - the body of the request from the route function
     * @param res - the response from the route function
     * @returns - either the modified account (if successful) or undefined (if unsuccessful)
     */
    static async adminUpdate(
        accountId: number,
        editAccountRequest: AdminEditAccountRequest,
        res: Response
    ): Promise<Account | undefined> {
        const { accountRepo } = getRepos();
        const account = await accountRepo.findOne(accountId);
        if (!account) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        // only change password if it's provided
        const newPassword: string = editAccountRequest.password
            ? await AccountService.hashPassword(editAccountRequest.password)
            : account.password;

        // only change clearance if it's < admin (use separate service for clearance promotions)
        // only change clearance if not modifying a super admin
        const newClearance: Clearance =
            editAccountRequest.clearance >= Clearance.ADMIN ||
            account.clearance >= Clearance.SUPER_ADMIN
                ? account.clearance
                : editAccountRequest.clearance;

        return await accountRepo.save({
            ...account,
            ...editAccountRequest,
            clearance: newClearance,
            password: newPassword,
        });
    }
}
