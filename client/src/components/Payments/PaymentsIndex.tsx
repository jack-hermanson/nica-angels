import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { CardBody, Col, Row } from "reactstrap";
import {
    LoadingSpinner,
    MobileToggleCard,
    PageHeader,
} from "jack-hermanson-component-lib";
import { useMinClearance } from "../../utils/useMinClearance";
import {
    Clearance,
    ExpandedSponsorshipRecord,
    PaymentRecord,
} from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";
import { SponsorTabs } from "../Sponsors/SponsorTabs";
import { Link } from "react-router-dom";
import { BUTTON_ICON_CLASSES, NEW_BUTTON_COLOR } from "../../utils/constants";
import { FaPlus } from "react-icons/fa";
import { PaymentClient } from "../../clients/PaymentClient";
import { SponsorshipClient } from "../../clients/SponsorshipClient";
import { PaymentGlance } from "./PaymentGlance";
import { FilterPayments } from "./FilterPayments";

export const PaymentsIndex: FunctionComponent = () => {
    useMinClearance(Clearance.ADMIN);

    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const [payments, setPayments] = useState<PaymentRecord[] | undefined>(
        undefined
    );
    const [filteredPayments, setFilteredPayments] = useState<
        PaymentRecord[] | undefined
    >(undefined);
    const [sponsorships, setSponsorships] = useState<
        ExpandedSponsorshipRecord[] | undefined
    >(undefined);

    useEffect(() => {
        if (token) {
            PaymentClient.getAll(token.data).then(data => {
                setPayments([...data]);
                setFilteredPayments([...data]);
            });
        }
    }, [token, setFilteredPayments, setPayments]);

    useEffect(() => {
        if (token) {
            SponsorshipClient.getExpandedSponsorships(token.data).then(data => {
                setSponsorships(data);
            });
        }
    }, [token, setSponsorships]);

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
                <div className="sticky-top">
                    {payments ? (
                        <FilterPayments
                            payments={payments}
                            setFilteredPayments={setFilteredPayments}
                        />
                    ) : (
                        <LoadingSpinner />
                    )}
                </div>
            </Col>
        );
    }

    function renderList() {
        return (
            <Col xs={12} lg={9}>
                {filteredPayments ? (
                    <Fragment>
                        {filteredPayments.map(payment => (
                            <PaymentGlance
                                payment={payment}
                                sponsorships={sponsorships}
                                key={payment.id}
                            />
                        ))}
                    </Fragment>
                ) : (
                    <LoadingSpinner />
                )}
            </Col>
        );
    }
};
