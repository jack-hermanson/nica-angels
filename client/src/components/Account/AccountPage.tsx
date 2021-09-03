import { FunctionComponent } from "react";
import { useStoreState } from "../../store/_store";
import { useMinClearance } from "../../utils/useMinClearance";
import { PageHeader } from "jack-hermanson-component-lib";
import { Col, Row } from "reactstrap";

export const AccountPage: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

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
                    <dl>
                        <dt>Token</dt>
                        <dd>{token?.data}</dd>

                        <dt>Date</dt>
                        <dd>{token?.created}</dd>
                    </dl>
                </Col>
            </Row>
        </div>
    );
};
