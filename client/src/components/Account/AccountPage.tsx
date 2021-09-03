import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { useStoreState } from "../../store/_store";
import { useMinClearance } from "../../utils/useMinClearance";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { Col, Row } from "reactstrap";
import * as timeago from "timeago.js";
import { tokenExpiration } from "../../../../shared/constants";
import { UserDetails } from "../User/UserDetails";

export const AccountPage: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);
    const currentUser = useStoreState(state => state.currentUser);

    const [created, setCreated] = useState<Date | undefined>(undefined);
    const [expires, setExpires] = useState<Date | undefined>(undefined);

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
    }, [token, setCreated, setExpires, tokenExpiration]);

    return (
        <div>
            <Row>
                <Col>
                    <PageHeader title={spanish ? "Cuenta" : "Account"} />
                </Col>
            </Row>
            <Row>
                <Col>
                    {currentUser ? (
                        <UserDetails user={currentUser} />
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
            <Row>
                <Col>
                    {!created || !expires ? (
                        <LoadingSpinner />
                    ) : (
                        <Fragment>
                            <dl>
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
        </div>
    );
};
