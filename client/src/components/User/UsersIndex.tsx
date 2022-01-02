import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { Col, Row } from "reactstrap";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { useMinClearance } from "../../utils/useMinClearance";
import { AccountRecord, Clearance } from "@nica-angels/shared";
import { AccountClient } from "../../clients/AccountClient";
import { UserGlance } from "./UserGlance";

export const UsersIndex: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    useMinClearance(Clearance.ADMIN);

    const [users, setUsers] = useState<AccountRecord[] | undefined>(undefined);

    useEffect(() => {
        if (token) {
            AccountClient.getAccounts(token.data).then(data => {
                setUsers(data);
            });
        }
    }, [setUsers, token]);

    return (
        <div>
            <SettingsTabs />
            {renderPageHeader()}
            {renderUsers()}
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader title={spanish ? "Usuarios" : "Users"} />
                </Col>
            </Row>
        );
    }

    function renderUsers() {
        return (
            <Row>
                <Col>
                    {users ? (
                        <Fragment>
                            {users.map(user => (
                                <UserGlance account={user} key={user.id} />
                            ))}
                        </Fragment>
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        );
    }
};
