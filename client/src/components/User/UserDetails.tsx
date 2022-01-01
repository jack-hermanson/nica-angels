import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { Col, Row } from "reactstrap";
import {
    KeyValTable,
    LoadingSpinner,
    PageHeader,
} from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { AccountRecord, Clearance } from "@nica-angels/shared";
import { useMinClearance } from "../../utils/useMinClearance";
import { AccountClient } from "../../clients/AccountClient";
import { ClearanceBadge } from "../Utils/ClearanceBadge";
import moment from "moment";

interface Props extends RouteComponentProps<{ id: string }> {}

export const UserDetails: FunctionComponent<Props> = ({ match }: Props) => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const [user, setUser] = useState<AccountRecord | undefined>(undefined);
    const [numTokens, setNumTokens] = useState<number | undefined>(undefined);

    useMinClearance(Clearance.ADMIN);

    useEffect(() => {
        if (token) {
            AccountClient.getAccount(
                parseInt(match.params.id),
                token.data
            ).then(data => {
                setUser(data);
            });

            AccountClient.getTokens(parseInt(match.params.id), token.data).then(
                data => {
                    setNumTokens(data);
                }
            );
        }
    }, [setUser, token, setNumTokens]);

    return (
        <div>
            <SettingsTabs />
            {renderPageHeader()}
            {renderUserInfo()}
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
                <Col>
                    {user ? (
                        <Fragment>
                            <KeyValTable
                                keyValPairs={[
                                    {
                                        key: spanish ? "Nombre" : "Name",
                                        val: `${user.firstName} ${user.lastName}`,
                                    },
                                    {
                                        key: spanish
                                            ? "Correo Electrónico"
                                            : "Email",
                                        val: user.email,
                                    },
                                    {
                                        key: "Tokens",
                                        val:
                                            numTokens === undefined
                                                ? "..."
                                                : numTokens,
                                    },
                                    {
                                        key: spanish
                                            ? "Autorización"
                                            : "Clearance",
                                        val: (
                                            <ClearanceBadge
                                                clearance={user.clearance}
                                            />
                                        ),
                                    },
                                    {
                                        key: spanish ? "Creado" : "Created",
                                        val: moment(user.created)
                                            .toDate()
                                            .toLocaleString(),
                                    },
                                    {
                                        key: spanish
                                            ? "Actualizado"
                                            : "Updated",
                                        val: moment(user.updated)
                                            .toDate()
                                            .toLocaleString(),
                                    },
                                ]}
                            />
                        </Fragment>
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        );
    }
};
