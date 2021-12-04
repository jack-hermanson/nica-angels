import { Request } from "../utils/Request";
import { Response } from "express";
import { HTTP } from "jack-hermanson-ts-utils";
import * as jwt from "jsonwebtoken";
import { getConnection } from "typeorm";
import { Token } from "../models/Token";
import { Account } from "../models/Account";
import { AuthError } from "../../../shared";
import { tokenHasExpired } from "../../../shared";

export const auth = async (
    req: Request<any>,
    res: Response,
    next: () => any
) => {
    try {
        if (!req.header("Authentication")) {
            return res
                .status(HTTP.BAD_REQUEST)
                .send('Missing "Authentication" header.');
        }
        const token = req.header("Authentication").replace("Bearer ", "");
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY) as {
            id: number;
        };

        const connection = getConnection();
        const tokenRepo = connection.getRepository(Token);
        const existingToken = await tokenRepo.findOne({
            data: token,
        });
        if (existingToken) {
            // is it expired?
            if (tokenHasExpired(existingToken)) {
                // yes it is expired
                console.log("EXPIRED");
                await tokenRepo.remove(existingToken);
                return res.status(HTTP.UNAUTHORIZED).send(AuthError.EXPIRED);
            } else {
                // not it isn't expired
                const accountRepo = connection.getRepository(Account);
                const account = await accountRepo.findOne({
                    id: decodedToken.id,
                });
                if (!account) {
                    return res
                        .status(HTTP.UNAUTHORIZED)
                        .send(AuthError.INVALID_ID);
                }
                req.account = account;
                next();
            }
        } else {
            // there is no matching token
            return res
                .status(HTTP.UNAUTHORIZED)
                .send(AuthError.NONEXISTENT_TOKEN);
        }
    } catch (error) {
        console.error(error);
        res.status(HTTP.UNAUTHORIZED).json(error);
    }
};
