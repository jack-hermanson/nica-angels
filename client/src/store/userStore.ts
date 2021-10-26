import { StoreModel } from "./_store";
import { action, Action, thunk, Thunk } from "easy-peasy";
import { AccountRecord, LoginRequest } from "../../../shared";
import { LogOutRequest, TokenRecord } from "../../../shared";
import { AccountClient } from "../clients/AccountClient";
import { LocalStorage } from "../utils/LocalStorage";
import { errorAlert, successAlert } from "jack-hermanson-ts-utils";

export interface UserStoreModel {
    currentUser: AccountRecord | undefined;
    setCurrentUser: Action<StoreModel, AccountRecord | undefined>;
    token: TokenRecord | undefined;
    setToken: Action<StoreModel, TokenRecord | undefined>;
    logIn: Thunk<StoreModel, LoginRequest>;
    logOut: Thunk<StoreModel, LogOutRequest>;
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
        try {
            const token: TokenRecord = await AccountClient.logIn(payload);
            actions.setToken(token);
            const user: AccountRecord = await AccountClient.getAccount(
                token.accountId,
                token.data
            );
            actions.setCurrentUser(user);
            actions.addAlert(successAlert("user", "logged in"));
            LocalStorage.saveToken(token);
        } catch (error: any) {
            actions.addAlert(
                errorAlert("Incorrect login information. Please try again.")
            );
            console.error(error.response);
            throw error;
        }
    }),
    logOut: thunk(async (actions, payload) => {
        const success = await AccountClient.logOut(payload);
        if (success) {
            actions.setCurrentUser(undefined);
            actions.setToken(undefined);
            LocalStorage.removeToken();
        }
    }),
};
