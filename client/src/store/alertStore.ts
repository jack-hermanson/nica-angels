import { Action, action } from "easy-peasy";
import { StoreModel } from "./_store";
import { AlertType } from "jack-hermanson-ts-utils";

export interface AlertStoreModel {
    alerts: AlertType[];
    setAlerts: Action<StoreModel, AlertType[]>;
    addAlert: Action<StoreModel, AlertType>;
}

export const alertStore: AlertStoreModel = {
    alerts: [],
    setAlerts: action((state, payload) => {
        state.alerts = payload;
    }),
    addAlert: action((state, payload) => {
        state.alerts = [payload, ...state.alerts];
    }),
};
