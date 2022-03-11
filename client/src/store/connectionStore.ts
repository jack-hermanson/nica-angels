import { Action, action } from "easy-peasy";
import { StoreModel } from "./_store";

export interface ConnectionStoreModel {
    connected: boolean;
    setConnected: Action<StoreModel, boolean>;
}

export const connectionStore: ConnectionStoreModel = {
    connected: false,
    setConnected: action((state, payload) => {
        state.connected = payload;
    }),
};
