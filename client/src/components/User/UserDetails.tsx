import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { Col, Row } from "reactstrap";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { AccountRecord, Clearance } from "@nica-angels/shared";
import { useMinClearance } from "../../utils/useMinClearance";
import { AccountClient } from "../../clients/AccountClient";

interface Props extends RouteComponentProps<{ id: string }> {}

export const UserDetails: FunctionComponent<Props> = ({ match }: Props) => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

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
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader
                        title={
                            spanish ? "Detalles del Usuario" : "User Details"
                        }
                    />
                </Col>
            </Row>
        );
    }

    function renderUserInfo() {
        return (
            <Row>
                <Col>{user ? <Fragment></Fragment> : <LoadingSpinner />}</Col>
            </Row>
        );
    }
};
