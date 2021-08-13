import { Account } from "../models/Account";
import { Response } from "express";
import { getConnection, Repository } from "typeorm";

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
}
