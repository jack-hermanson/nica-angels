import {
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useCallback,
} from "react";
import { AccountRecord, Clearance } from "@nica-angels/shared";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { useMinClearance } from "../../utils/useMinClearance";
import { PromoteClearanceForm } from "./PromoteClearanceForm";
import { AccountClient } from "../../clients/AccountClient";
import { useStoreState } from "../../store/_store";

interface Props {
    user: AccountRecord;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    callback?: () => any;
}

export const PromoteClearanceModal: FunctionComponent<Props> = ({
    user,
    isOpen,
    setIsOpen,
    callback,
}: Props) => {
    const toggle = useCallback(() => {
        setIsOpen(o => !o);
    }, [setIsOpen]);

    const token = useStoreState(state => state.token);

    useMinClearance(Clearance.SUPER_ADMIN);

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle}>Clearance</ModalHeader>
            <ModalBody>
                <PromoteClearanceForm
                    onSubmit={async promoteRequest => {
                        if (token) {
                            await AccountClient.promoteClearance(
                                user.id,
                                promoteRequest,
                                token.data
                            );
                            toggle();
                            callback?.();
                        }
                    }}
                    existingAccount={user}
                />
            </ModalBody>
        </Modal>
    );
};
