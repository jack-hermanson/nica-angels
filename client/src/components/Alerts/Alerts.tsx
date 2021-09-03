import { FunctionComponent } from "react";
import { useStoreActions, useStoreState } from "../../store/_store";
import { AlertPanel } from "jack-hermanson-component-lib";

export const Alerts: FunctionComponent = () => {
    const alerts = useStoreState(state => state.alerts);
    const setAlerts = useStoreActions(actions => actions.setAlerts);

    return (
        <div>
            {alerts.map(alert => {
                const removeAlert = () => {
                    setAlerts(alerts.filter(a => a !== alert));
                };
                const key = `${Math.random()}-${
                    alert.text ? alert.text : Math.random().toString()
                }`;
                return (
                    <AlertPanel
                        key={key}
                        alert={alert}
                        removeAlert={() => removeAlert()}
                    />
                );
            })}
        </div>
    );
};
