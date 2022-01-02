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

interface Props {
    user: AccountRecord;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const PromoteClearanceModal: FunctionComponent<Props> = ({
    user,
    isOpen,
    setIsOpen,
}: Props) => {
    const toggle = useCallback(() => {
        setIsOpen(o => !o);
    }, [setIsOpen]);

    useMinClearance(Clearance.SUPER_ADMIN);

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle}>
                <h5 className="mb-0">Clearance</h5>
            </ModalHeader>
            <ModalBody>
                <PromoteClearanceForm
                    onSubmit={async promoteRequest => {
                        console.log(promoteRequest);
                        toggle();
                    }}
                    existingAccount={user}
                />
            </ModalBody>
        </Modal>
    );
};
