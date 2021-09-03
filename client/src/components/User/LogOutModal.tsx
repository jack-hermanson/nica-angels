import { ConfirmationModal } from "jack-hermanson-component-lib";
import { Dispatch, FunctionComponent, SetStateAction, useState } from "react";
import {
    LogOutRequest,
    TokenRecord,
} from "../../../../shared/resource_models/token";
import { useStoreActions } from "../../store/_store";
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

    return (
        <ConfirmationModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={"Log Out Confirmation"}
            onConfirm={executeLogOut}
        >
            <p>
                Please confirm that you would like to log out. Check the box
                below to log out of all devices, not just this one.
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
                    Log out everywhere
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
