import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { useStoreState } from "../../store/_store";
import { useMinClearance } from "../../utils/useMinClearance";
import {
    ActionsDropdown,
    LoadingSpinner,
    PageHeader,
} from "jack-hermanson-component-lib";
import { Col, Row } from "reactstrap";
import * as timeago from "timeago.js";
import { Clearance, tokenExpiration } from "@nica-angels/shared";
import { AccountDetails } from "./AccountDetails";
import {
    ClickDropdownAction,
    LinkDropdownAction,
} from "jack-hermanson-ts-utils";
import { LogOutModal } from "./LogOutModal";
import { useHistory } from "react-router-dom";

export const AccountPage: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);
    const currentUser = useStoreState(state => state.currentUser);

    const [created, setCreated] = useState<Date | undefined>(undefined);
    const [expires, setExpires] = useState<Date | undefined>(undefined);
    const [showLogOutModal, setShowLogOutModal] = useState(false);

    const history = useHistory();

    useMinClearance();

    useEffect(() => {
        if (token) {
            const creationDate = new Date(token.created);
            const expirationDate = new Date(
                creationDate.getTime() + tokenExpiration
            );

            setCreated(creationDate);
            setExpires(expirationDate);
        }
    }, [token, setCreated, setExpires]);

    return (
        <div>
            <Row>
                <Col>
                    <PageHeader title={spanish ? "Cuenta" : "Account"}>
                        <ActionsDropdown
                            menuName={spanish ? "Acciones" : "Actions"}
                            size="sm"
                            options={[
                                new LinkDropdownAction(
                                    spanish ? "Editar Cuenta" : "Edit Account",
                                    "/account/edit"
                                ),
                                new ClickDropdownAction(
                                    spanish ? "Cerrar Sesión" : "Log Out",
                                    () => {
                                        setShowLogOutModal(true);
                                    }
                                ),
                            ]}
                        />
                    </PageHeader>
                </Col>
            </Row>
            {renderUserDetails()}
            {renderTokenDetails()}
            {renderLogOutModal()}
        </div>
    );

    function renderUserDetails() {
        return (
            <Row>
                <Col>
                    {currentUser ? (
                        <AccountDetails user={currentUser} />
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        );
    }

    function renderTokenDetails() {
        if (currentUser && currentUser.clearance >= Clearance.ADMIN) {
            return (
                <Row>
                    <Col>
                        {!created || !expires ? (
                            <LoadingSpinner />
                        ) : (
                            <Fragment>
                                <dl>
                                    <dt>Token ID</dt>
                                    <dd>{token?.id}</dd>

                                    <dt>Token Created</dt>
                                    <dd>{timeago.format(created)}</dd>

                                    <dt>Token Expires</dt>
                                    <dd>
                                        {`${expires.toLocaleDateString()} at ${expires.toLocaleTimeString()}`}
                                    </dd>
                                </dl>
                            </Fragment>
                        )}
                    </Col>
                </Row>
            );
        }
    }

    function renderLogOutModal() {
        if (token) {
            return (
                <LogOutModal
                    isOpen={showLogOutModal}
                    setIsOpen={setShowLogOutModal}
                    token={token}
                    callback={() => {
                        history.push("/account/login");
                    }}
                />
            );
        }
    }
};
