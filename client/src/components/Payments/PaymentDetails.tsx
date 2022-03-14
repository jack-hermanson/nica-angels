import { RouteComponentProps } from "react-router-dom";
import { FunctionComponent } from "react";
import { SponsorTabs } from "../Sponsors/SponsorTabs";
import { PageHeader } from "jack-hermanson-component-lib";
import { Col, Row } from "reactstrap";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";

interface Props extends RouteComponentProps<{ id: string }> {}

export const PaymentDetails: FunctionComponent<Props> = ({ match }: Props) => {
    useMinClearance(Clearance.ADMIN);

    const spanish = useStoreState(state => state.spanish);

    return (
        <div>
            <SponsorTabs />
            {renderPageHeader()}
            {renderInfo()}
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader
                        title={spanish ? "Pago Detalles" : "Payment Details"}
                    />
                </Col>
            </Row>
        );
    }

    function renderInfo() {
        return (
            <Row>
                <Col>
                    <p>Info</p>
                </Col>
            </Row>
        );
    }
};
