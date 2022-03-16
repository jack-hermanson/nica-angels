import { FunctionComponent, useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance, SponsorshipRecord } from "@nica-angels/shared";
import { useStoreActions, useStoreState } from "../../store/_store";
import { SponsorTabs } from "../Sponsors/SponsorTabs";
import { CreateEditPaymentForm } from "./CreateEditPaymentForm";
import { PaymentRequest } from "@nica-angels/shared";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { PaymentClient } from "../../clients/PaymentClient";
import { scrollToTop, successAlert } from "jack-hermanson-ts-utils";
import { SponsorshipClient } from "../../clients/SponsorshipClient";

interface Props extends RouteComponentProps<{ sponsorshipId?: string }> {}

export const CreatePayment: FunctionComponent<Props> = ({ match }: Props) => {
    useMinClearance(Clearance.ADMIN);

    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);
    const addAlert = useStoreActions(actions => actions.addAlert);

    const history = useHistory();

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
                    <CreateEditPaymentForm
                        onSubmit={onSubmit}
                        sponsorshipId={
                            match.params.sponsorshipId
                                ? parseInt(match.params.sponsorshipId)
                                : undefined
                        }
                    />
                </Col>
            </Row>
        );
    }

    async function onSubmit(paymentRequest: PaymentRequest) {
        if (token) {
            try {
                const payment = await PaymentClient.create(
                    paymentRequest,
                    token.data
                );
                addAlert(
                    successAlert(
                        `payment of $${payment.amount.toFixed(2)}`,
                        "saved"
                    )
                );
                history.push("/payments");
            } catch (error: any) {
                console.error(error);
                console.error(error.response);
                addAlert(error.message);
                scrollToTop();
            }
        }
    }
};
