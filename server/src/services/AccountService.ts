import { Account } from "../models/Account";
import { Response } from "express";
import { getConnection, Repository } from "typeorm";
import {
    LoginRequest,
    RegisterRequest,
} from "../../../shared/resource_models/account";
import { doesNotConflict, HTTP } from "jack-hermanson-ts-utils";
import { Token } from "../models/Token";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { TokenLoginRequest } from "../../../shared/resource_models/token";

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

        const salt = await bcrypt.genSalt(10);
        account.password = await bcrypt.hash(registerRequest.password, salt);

        return await accountRepo.save(account);
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
}
