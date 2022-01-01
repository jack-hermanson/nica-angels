import { FunctionComponent, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { Col, Row } from "reactstrap";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { useMinClearance } from "../../utils/useMinClearance";
import { AccountRecord, Clearance } from "@nica-angels/shared";
import { AccountClient } from "../../clients/AccountClient";

interface Props extends RouteComponentProps<{ id: string }> {}

export const EditUser: FunctionComponent<Props> = ({ match }: Props) => {
    const token = useStoreState(state => state.token);
    const spanish = useStoreState(state => state.spanish);

    const [user, setUser] = useState<AccountRecord | undefined>(undefined);

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
                <Col>{user ? <p>Form here</p> : <LoadingSpinner />}</Col>
            </Row>
        );
    }
};
