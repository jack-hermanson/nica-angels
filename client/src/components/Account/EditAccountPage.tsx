import { FunctionComponent } from "react";
import { Col, Row } from "reactstrap";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance, EditAccountRequest } from "@nica-angels/shared";
import { EditAccountForm } from "./EditAccountForm";

export const EditAccountPage: FunctionComponent = () => {
    useMinClearance(Clearance.ADMIN);

    const currentUser = useStoreState(state => state.currentUser);
    const token = useStoreState(state => state.token);
    const spanish = useStoreState(state => state.spanish);

    return (
        <div>
            {renderPageHeader()}
            {renderForm()}
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader
                        title={spanish ? "Editar Mi Cuenta" : "Edit My Account"}
                    />
                </Col>
            </Row>
        );
    }

    function renderForm() {
        return (
            <Row>
                <Col xs={12} lg={6}>
                    {currentUser ? (
                        <EditAccountForm
                            onSubmit={onSubmit}
                            existingAccount={currentUser}
                        />
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        );
    }

    async function onSubmit(editAccountRequest: EditAccountRequest) {
        if (token) {
            console.log(editAccountRequest);
        }
    }
};
