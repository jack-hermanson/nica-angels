import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { useStoreState } from "../../store/_store";
import { Form, Formik, FormikProps } from "formik";
import {
    ExpandedSponsorshipRecord,
    PaymentMethod,
    PaymentRecord,
    PaymentRequest,
} from "@nica-angels/shared";
import { SponsorshipClient } from "../../clients/SponsorshipClient";
import { LoadingSpinner } from "jack-hermanson-component-lib";
import * as yup from "yup";
import { Col, Row } from "reactstrap";

interface Props {
    onSubmit: (paymentRequest: PaymentRequest) => Promise<void>;
    existingPayment?: PaymentRecord;
}

export const CreateEditPaymentForm: FunctionComponent<Props> = ({
    onSubmit,
    existingPayment,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const [sponsorships, setSponsorships] = useState<
        ExpandedSponsorshipRecord[] | undefined
    >(undefined);

    useEffect(() => {
        if (token) {
            SponsorshipClient.getExpandedSponsorships(token.data).then(data => {
                setSponsorships(data);
            });
        }
    }, [setSponsorships, token]);

    interface FormValues {
        amount: string;
        paymentMethod: string;
        notes: string;
        sponsorshipId: string;
        referenceNumber: string;
    }

    const validationSchema = yup.object().shape({
        amount: yup.number().label("Amount").required().positive(),
        paymentMethod: yup
            .number()
            .label("Payment Method")
            .min(PaymentMethod.CREDIT_DEBIT_CARD)
            .max(PaymentMethod.ACH_BANK_TRANSFER)
            .required(),
        notes: yup.string().optional(),
        sponsorshipId: yup.number().label("Sponsorship").required().positive(),
        referenceNumber: yup.string().optional().label("Reference Number"),
    });

    return (
        <Formik
            initialValues={{
                amount: existingPayment
                    ? existingPayment.amount.toString()
                    : "",
                paymentMethod: existingPayment
                    ? existingPayment.paymentMethod.toString()
                    : "",
                notes: existingPayment?.notes || "",
                sponsorshipId: existingPayment
                    ? existingPayment.sponsorshipId.toString()
                    : "",
                referenceNumber: existingPayment?.referenceNumber || "",
            }}
            onSubmit={async (data, { setSubmitting }) => {
                setSubmitting(true);
                const paymentRequest: PaymentRequest = {
                    amount: parseFloat(data.amount),
                    paymentMethod: parseInt(
                        data.paymentMethod
                    ) as PaymentMethod,
                    notes: data.notes.trim() || undefined,
                    sponsorshipId: parseInt(data.sponsorshipId),
                    referenceNumber: data.referenceNumber.trim() || undefined,
                };
                await onSubmit(paymentRequest);
            }}
            validationSchema={validationSchema}
            validateOnChange={false}
            validateOnBlur={false}
        >
            {({ errors, isSubmitting }: FormikProps<FormValues>) => (
                <Form>
                    {isSubmitting ? (
                        <LoadingSpinner />
                    ) : (
                        <Fragment>
                            <Row>
                                <Col xs={12} lg={6}></Col>
                            </Row>
                        </Fragment>
                    )}
                </Form>
            )}
        </Formik>
    );
};
