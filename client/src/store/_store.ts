import { createStore, createTypedHooks } from "easy-peasy";
import { settingsStore, SettingsStoreModel } from "./settingsStore";
import { userStore, UserStoreModel } from "./userStore";

export interface StoreModel extends SettingsStoreModel, UserStoreModel {}

export const store = createStore<StoreModel>({
    ...settingsStore,
    ...userStore,
} as StoreModel);

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;
