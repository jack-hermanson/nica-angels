import { FunctionComponent } from "react";
import { Col, Row } from "reactstrap";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { useStoreActions, useStoreState } from "../../store/_store";
import { useMinClearance } from "../../utils/useMinClearance";
import { EditAccountRequest } from "@nica-angels/shared";
import { EditAccountForm } from "./EditAccountForm";
import { AccountClient } from "../../clients/AccountClient";
import { scrollToTop } from "jack-hermanson-ts-utils";
import { useHistory } from "react-router-dom";

export const EditAccountPage: FunctionComponent = () => {
    useMinClearance();

    const currentUser = useStoreState(state => state.currentUser);
    const token = useStoreState(state => state.token);
    const spanish = useStoreState(state => state.spanish);

    const addAlert = useStoreActions(actions => actions.addAlert);
    const setCurrentUser = useStoreActions(actions => actions.setCurrentUser);

    const history = useHistory();

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
            try {
                const updatedAccount = await AccountClient.editMyAccount(
                    editAccountRequest,
                    token.data
                );
                setCurrentUser(updatedAccount);
                addAlert({
                    color: "success",
                    text: `Account for ${updatedAccount.firstName} ${updatedAccount.lastName} saved successfully.`,
                });
                history.push("/account");
            } catch (error: any) {
                addAlert({
                    color: "danger",
                    text: error.message,
                });
                scrollToTop();
            }
        }
    }
};
