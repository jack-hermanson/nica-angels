import { FunctionComponent, useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { Col, Row } from "reactstrap";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { useStoreActions, useStoreState } from "../../store/_store";
import { useMinClearance } from "../../utils/useMinClearance";
import { AccountRecord, Clearance } from "@nica-angels/shared";
import { AccountClient } from "../../clients/AccountClient";
import { AdminEditUserForm } from "./AdminEditUserForm";
import { scrollToTop } from "jack-hermanson-ts-utils";

interface Props extends RouteComponentProps<{ id: string }> {}

export const EditUser: FunctionComponent<Props> = ({ match }: Props) => {
    const token = useStoreState(state => state.token);
    const spanish = useStoreState(state => state.spanish);
    const addAlert = useStoreActions(actions => actions.addAlert);

    const [user, setUser] = useState<AccountRecord | undefined>(undefined);

    const history = useHistory();

    useMinClearance(Clearance.ADMIN);

    useEffect(() => {
        if (token) {
            AccountClient.getAccount(
                parseInt(match.params.id),
                token.data
            ).then(data => {
                setUser(data);
            });
        }
    }, [setUser, token]);

    return (
        <div>
            <SettingsTabs />
            {renderPageHeader()}
            {renderForm()}
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader
                        title={spanish ? "Editar Usuario" : "Edit User"}
                    />
                </Col>
            </Row>
        );
    }

    function renderForm() {
        return (
            <Row>
                <Col xs={12} lg={6}>
                    {user ? (
                        <AdminEditUserForm
                            existingRecord={user}
                            onSubmit={async adminEditAccountRequest => {
                                if (token) {
                                    try {
                                        await AccountClient.adminUpdate(
                                            user.id,
                                            adminEditAccountRequest,
                                            token.data
                                        );
                                        addAlert({
                                            text: "User updated successfully.",
                                            color: "success",
                                        });
                                        history.push(
                                            `/settings/users/${user.id}`
                                        );
                                    } catch (error: any) {
                                        console.error(error);
                                        addAlert({
                                            text: error.message,
                                            color: "danger",
                                        });
                                        scrollToTop();
                                    }
                                }
                            }}
                        />
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        );
    }
};
