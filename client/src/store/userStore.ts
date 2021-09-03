import { StoreModel } from "./_store";
import { action, Action, thunk, Thunk } from "easy-peasy";
import {
    AccountRecord,
    LoginRequest,
} from "../../../shared/resource_models/account";
import { TokenRecord } from "../../../shared/resource_models/token";
import { AccountClient } from "../clients/AccountClient";
import { LocalStorage } from "../utils/LocalStorage";

export interface UserStoreModel {
    currentUser: AccountRecord | undefined;
    setCurrentUser: Action<StoreModel, AccountRecord | undefined>;
    token: TokenRecord | undefined;
    setToken: Action<StoreModel, TokenRecord | undefined>;
    logIn: Thunk<StoreModel, LoginRequest>;
}

export const userStore: UserStoreModel = {
    currentUser: undefined,
    setCurrentUser: action((state, payload) => {
        state.currentUser = payload;
    }),
    token: undefined,
    setToken: action((state, payload) => {
        state.token = payload;
        if (payload) {
            LocalStorage.saveToken(payload);
        } else {
            LocalStorage.removeToken();
        }
    }),
    logIn: thunk(async (actions, payload) => {
        const token: TokenRecord = await AccountClient.logIn(payload);
        actions.setToken(token);
        const user: AccountRecord = await AccountClient.getAccount(
            token.accountId,
            token.data
        );
        actions.setCurrentUser(user);
        LocalStorage.saveToken(token);
    }),
};
