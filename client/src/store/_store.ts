import { createStore, createTypedHooks } from "easy-peasy";
import { settingsStore, SettingsStoreModel } from "./settingsStore";

export interface StoreModel extends SettingsStoreModel {}

export const store = createStore<StoreModel>({
    ...settingsStore,
} as StoreModel);

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;
