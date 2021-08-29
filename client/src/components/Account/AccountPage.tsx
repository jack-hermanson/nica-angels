import { useEffect, FunctionComponent } from "react";
import { useStoreState } from "../../store/_store";
import { useMinClearance } from "../../utils/useMinClearance";
import { PageHeader } from "jack-hermanson-component-lib";
import { Col, Row } from "reactstrap";

export const AccountPage: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);

    useMinClearance();

    return (
        <div>
            <Row>
                <Col>
                    <PageHeader title={spanish ? "Cuenta" : "Account"} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>Account page</p>
                </Col>
            </Row>
        </div>
    );
};
