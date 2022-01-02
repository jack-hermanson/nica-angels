import { ConfirmationModal } from "jack-hermanson-component-lib";
import { Dispatch, FunctionComponent, SetStateAction, useState } from "react";
import { LogOutRequest, TokenRecord } from "@nica-angels/shared";
import { useStoreActions, useStoreState } from "../../store/_store";
import { FormGroup, Input, Label } from "reactstrap";

interface Props {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    token: TokenRecord;
    callback: () => any;
}

export const LogOutModal: FunctionComponent<Props> = ({
    isOpen,
    setIsOpen,
    token,
    callback,
}: Props) => {
    const [logOutEverywhere, setLogOutEverywhere] = useState(false);
    const logOut = useStoreActions(actions => actions.logOut);
    const spanish = useStoreState(state => state.spanish);

    return (
        <ConfirmationModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={spanish ? "Confirmar Cerrar Sesión" : "Log Out Confirmation"}
            onConfirm={executeLogOut}
            buttonText={spanish ? "Cerrar Sesión" : "Log Out"}
            buttonColor="danger"
        >
            <p>
                {spanish
                    ? `Favor de confirmar que quiere cerrar esta sesión. Activar la casilla para cerrar cada sesión en cada dispositivo electrónico.`
                    : `Please confirm that you would like to log out. Check the box below to log out of all devices, not just this one.`}
            </p>
            <form>{renderLogOutEverywhereCheck()}</form>
        </ConfirmationModal>
    );

    function renderLogOutEverywhereCheck() {
        const id = "log-out-everywhere-input";
        return (
            <FormGroup check>
                <Input
                    type="checkbox"
                    checked={logOutEverywhere}
                    onChange={e => setLogOutEverywhere(e.target.checked)}
                    id={id}
                />
                <Label className="form-check-label" for={id}>
                    {spanish ? "Cerrar cada sesión" : "Log out everywhere"}
                </Label>
            </FormGroup>
        );
    }

    async function executeLogOut() {
        const logOutRequest: LogOutRequest = {
            token: token.data,
            logOutEverywhere: logOutEverywhere,
        };
        await logOut(logOutRequest);
        callback();
    }
};
