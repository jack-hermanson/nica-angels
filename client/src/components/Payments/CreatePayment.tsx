import { FunctionComponent } from "react";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";
import { SponsorTabs } from "../Sponsors/SponsorTabs";
import { CreateEditPaymentForm } from "./CreateEditPaymentForm";
import { PaymentRequest } from "@nica-angels/shared";

export const CreatePayment: FunctionComponent = () => {
    useMinClearance(Clearance.ADMIN);

    const spanish = useStoreState(state => state.spanish);

    return (
        <div>
            <SponsorTabs />
            {renderPageHeader()}
            {renderForm()}
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader
                        title={spanish ? "Nuevo Pago" : "New Payment"}
                    />
                </Col>
            </Row>
        );
    }

    function renderForm() {
        return (
            <Row>
                <Col>
                    <CreateEditPaymentForm onSubmit={onSubmit} />
                </Col>
            </Row>
        );
    }

    async function onSubmit(paymentRequest: PaymentRequest) {
        console.log(paymentRequest);
    }
};
