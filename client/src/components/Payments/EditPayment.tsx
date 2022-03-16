import { RouteComponentProps, useHistory } from "react-router-dom";
import { FunctionComponent, useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance, PaymentRecord, PaymentRequest } from "@nica-angels/shared";
import { useStoreActions, useStoreState } from "../../store/_store";
import { SponsorTabs } from "../Sponsors/SponsorTabs";
import { PaymentClient } from "../../clients/PaymentClient";
import { errorAlert, scrollToTop, successAlert } from "jack-hermanson-ts-utils";
import { CreateEditPaymentForm } from "./CreateEditPaymentForm";

interface Props extends RouteComponentProps<{ id: string }> {}

export const EditPayment: FunctionComponent<Props> = ({ match }: Props) => {
    useMinClearance(Clearance.ADMIN);

    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);
    const addAlert = useStoreActions(actions => actions.addAlert);

    const [payment, setPayment] = useState<PaymentRecord | undefined>(
        undefined
    );

    const history = useHistory();

    useEffect(() => {
        if (token) {
            PaymentClient.getOne(parseInt(match.params.id), token.data).then(
                data => {
                    setPayment(data);
                }
            );
        }
    }, [setPayment, token, match]);

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
                        title={spanish ? "Editar Pago" : "Edit Payment"}
                    />
                </Col>
            </Row>
        );
    }

    function renderForm() {
        return (
            <Row>
                <Col>
                    {payment ? (
                        <CreateEditPaymentForm
                            onSubmit={onSubmit}
                            existingPayment={payment}
                        />
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        );
    }

    async function onSubmit(paymentRequest: PaymentRequest) {
        if (token) {
            try {
                const editedPayment = await PaymentClient.edit(
                    parseInt(match.params.id),
                    paymentRequest,
                    token.data
                );
                addAlert(
                    successAlert(`payment #${editedPayment.id}`, "edited")
                );
                history.push("/payments");
            } catch (error: any) {
                console.error(error);
                console.error(error.response);
                addAlert(errorAlert(error.message));
                scrollToTop();
            }
        }
    }
};
