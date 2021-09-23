import { Request as ExpressRequest } from "express";
import { Account } from "../models/Account";

export interface Request<T, ResBody = any, ReqBody = any, ReqQuery = any>
    extends ExpressRequest<T, ResBody, ReqBody, ReqQuery> {
    account?: Account;
}
