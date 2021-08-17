import { Request as ExpressRequest } from "express";
import { Account } from "../models/Account";

export interface Request<T> extends ExpressRequest<T> {
    account?: Account;
}
