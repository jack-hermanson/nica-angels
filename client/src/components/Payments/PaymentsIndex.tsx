import { FunctionComponent } from "react";
import { CardBody, Col, Row } from "reactstrap";
import { MobileToggleCard, PageHeader } from "jack-hermanson-component-lib";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";
import { SponsorTabs } from "../Sponsors/SponsorTabs";

export const PaymentsIndex: FunctionComponent = () => {
    useMinClearance(Clearance.ADMIN);

    const spanish = useStoreState(state => state.spanish);

    return (
        <div>
            <SponsorTabs />
            {renderPageHeader()}
            <Row>
                {renderFiltering()}
                {renderList()}
            </Row>
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader title={spanish ? "Pagos" : "Payments"} />
                </Col>
            </Row>
        );
    }

    function renderFiltering() {
        return (
            <Col xs={12} lg={3} className="mb-3 mb-lg-0">
                <MobileToggleCard cardTitle="Filtering" className="sticky-top">
                    <CardBody>
                        <p>Add filtering here</p>
                    </CardBody>
                </MobileToggleCard>
            </Col>
        );
    }

    function renderList() {
        return (
            <Col xs={12} lg={9}>
                <p>List of items.</p>
            </Col>
        );
    }
};
