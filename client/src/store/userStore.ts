import { StoreModel } from "./_store";
import { action, Action, thunk, Thunk } from "easy-peasy";
import { AccountRecord } from "../../../shared/resource_models/account";

export interface UserStoreModel {
    currentUser: AccountRecord | undefined;
    setCurrentUser: Action<StoreModel, AccountRecord | undefined>;
}

export const userStore: UserStoreModel = {
    currentUser: undefined,
    setCurrentUser: action((state, payload) => {
        state.currentUser = payload;
    }),
};
