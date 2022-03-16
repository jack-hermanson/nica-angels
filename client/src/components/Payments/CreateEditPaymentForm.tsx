import {
    ChangeEvent,
    Fragment,
    FunctionComponent,
    useEffect,
    useState,
} from "react";
import { useStoreState } from "../../store/_store";
import {
    Field,
    Form,
    Formik,
    FormikErrors,
    FormikHelpers,
    FormikProps,
} from "formik";
import {
    ExpandedSponsorshipRecord,
    PaymentMethod,
    PaymentRecord,
    PaymentRequest,
} from "@nica-angels/shared";
import { SponsorshipClient } from "../../clients/SponsorshipClient";
import { FormError, LoadingSpinner } from "jack-hermanson-component-lib";
import * as yup from "yup";
import {
    Button,
    Col,
    FormGroup,
    Input,
    InputGroup,
    InputGroupText,
    Label,
    Row,
} from "reactstrap";
import { SUBMIT_BUTTON_COLOR } from "../../utils/constants";

interface Props {
    onSubmit: (paymentRequest: PaymentRequest) => Promise<void>;
    existingPayment?: PaymentRecord;
    sponsorshipId?: number;
}

export const CreateEditPaymentForm: FunctionComponent<Props> = ({
    onSubmit,
    existingPayment,
    sponsorshipId,
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

    type Err = FormikErrors<FormValues>;
    type SetFieldValue = (
        field: string,
        value: any,
        shouldValidate?: boolean | undefined
    ) => void;

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
                sponsorshipId: sponsorshipId
                    ? sponsorshipId.toString()
                    : existingPayment
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
            {({
                errors,
                isSubmitting,
                setFieldValue,
                values,
                handleChange,
            }: FormikProps<FormValues>) => (
                <Form>
                    {isSubmitting ? (
                        <LoadingSpinner />
                    ) : (
                        <Fragment>
                            <Row>
                                <Col xs={12} lg={6}>
                                    {renderSponsorshipId(
                                        values,
                                        setFieldValue,
                                        handleChange,
                                        errors
                                    )}
                                </Col>
                                <Col xs={12} lg={6}>
                                    {renderAmount(errors)}
                                </Col>
                            </Row>
                            <Row>
                                <Col>{renderButtons()}</Col>
                            </Row>
                        </Fragment>
                    )}
                </Form>
            )}
        </Formik>
    );

    function renderSponsorshipId(
        values: FormValues,
        setFieldValue: SetFieldValue,
        handleChange: (changeEvent: ChangeEvent<any>) => any,
        errors: Err
    ) {
        const id = "sponsorship-id-input";
        if (sponsorships) {
            return (
                <FormGroup>
                    <Label className="form-label required" for={id}>
                        {spanish ? "Patrocinio" : "Sponsorship"}
                    </Label>
                    <Field
                        id={id}
                        name="sponsorshipId"
                        type="select"
                        as={Input}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            console.log(event.target.value);
                            handleChange(event);
                            const sponsorship = sponsorships.find(
                                s => s.id === parseInt(event.target.value)
                            );
                            if (sponsorship) {
                                setFieldValue(
                                    "amount",
                                    sponsorship.payment.toFixed(2)
                                );
                            } else {
                                setFieldValue("amount", "");
                            }
                        }}
                    >
                        <option value="">
                            {spanish
                                ? "Elegir un patrocinio..."
                                : "Select a sponsorship..."}
                        </option>
                        {sponsorships.map(sponsorship => (
                            <option key={sponsorship.id} value={sponsorship.id}>
                                {sponsorship.studentName} &{" "}
                                {sponsorship.sponsorName} @ $
                                {sponsorship.payment}*{sponsorship.frequency} (#
                                {sponsorship.id})
                            </option>
                        ))}
                    </Field>
                    <FormError>{errors.sponsorshipId}</FormError>
                </FormGroup>
            );
        }
    }

    function renderAmount(errors: Err) {
        const id = "amount-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    {spanish ? "Aumento" : "Amount"}
                </Label>
                <InputGroup>
                    <InputGroupText>$</InputGroupText>
                    <Field
                        id={id}
                        type="number"
                        step="1.00"
                        name="amount"
                        as={Input}
                    />
                </InputGroup>
                <FormError>{errors.amount}</FormError>
            </FormGroup>
        );
    }

    function renderButtons() {
        return (
            <div className="bottom-buttons">
                <Button color={SUBMIT_BUTTON_COLOR} type="submit">
                    Save
                </Button>
            </div>
        );
    }
};
