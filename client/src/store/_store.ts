import { createStore, createTypedHooks } from "easy-peasy";
import { settingsStore, SettingsStoreModel } from "./settingsStore";
import { userStore, UserStoreModel } from "./userStore";
import { alertStore, AlertStoreModel } from "./alertStore";
import { connectionStore, ConnectionStoreModel } from "./connectionStore";

export interface StoreModel
    extends SettingsStoreModel,
        UserStoreModel,
        AlertStoreModel,
        ConnectionStoreModel {}

export const store = createStore<StoreModel>({
    ...settingsStore,
    ...userStore,
    ...alertStore,
    ...connectionStore,
} as StoreModel);

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;
