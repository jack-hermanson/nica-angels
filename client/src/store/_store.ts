import { createStore, createTypedHooks } from "easy-peasy";
import { SettingsStoreModel } from "./settingsStore";

export interface StoreModel extends SettingsStoreModel {}

export const store = createStore<StoreModel>({} as StoreModel);

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;
