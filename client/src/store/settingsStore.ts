import { StoreModel } from "./_store";
import { Action, action } from "easy-peasy";

export interface SettingsStoreModel {
    spanish: boolean;
    setSpanish: Action<StoreModel, boolean>;
}

export const settingsStore: SettingsStoreModel = {
    spanish: false,
    setSpanish: action((state, payload) => {
        state.spanish = payload;
    }),
};
