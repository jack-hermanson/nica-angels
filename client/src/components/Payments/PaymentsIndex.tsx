import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { CardBody, Col, Row } from "reactstrap";
import {
    LoadingSpinner,
    MobileToggleCard,
    PageHeader,
} from "jack-hermanson-component-lib";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance, PaymentRecord } from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";
import { SponsorTabs } from "../Sponsors/SponsorTabs";
import { Link } from "react-router-dom";
import { BUTTON_ICON_CLASSES, NEW_BUTTON_COLOR } from "../../utils/constants";
import { FaPlus } from "react-icons/fa";
import { PaymentClient } from "../../clients/PaymentClient";

export const PaymentsIndex: FunctionComponent = () => {
    useMinClearance(Clearance.ADMIN);

    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const [payments, setPayments] = useState<PaymentRecord[] | undefined>(
        undefined
    );

    useEffect(() => {
        if (token) {
            PaymentClient.getAll(token.data).then(data => {
                setPayments(data);
            });
        }
    }, [token, setPayments]);

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
                    <PageHeader title={spanish ? "Pagos" : "Payments"}>
                        <Link
                            to="/payments/new"
                            className={`icon-button btn btn-sm btn-${NEW_BUTTON_COLOR}`}
                        >
                            <FaPlus className={BUTTON_ICON_CLASSES} />
                            {spanish ? "Nuevo Pago" : "New Payment"}
                        </Link>
                    </PageHeader>
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
                {payments ? (
                    <Fragment>
                        {payments.map(payment => (
                            <p key={payment.id}>
                                {payment.id}, ${payment.amount.toFixed(2)}
                            </p>
                        ))}
                    </Fragment>
                ) : (
                    <LoadingSpinner />
                )}
            </Col>
        );
    }
};
