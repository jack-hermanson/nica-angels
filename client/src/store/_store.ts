import { createStore, createTypedHooks } from "easy-peasy";
import { settingsStore, SettingsStoreModel } from "./settingsStore";
import { userStore, UserStoreModel } from "./userStore";
import { alertStore, AlertStoreModel } from "./alertStore";

export interface StoreModel
    extends SettingsStoreModel,
        UserStoreModel,
        AlertStoreModel {}

export const store = createStore<StoreModel>({
    ...settingsStore,
    ...userStore,
    ...alertStore,
} as StoreModel);

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;
