import { Fragment, FunctionComponent, useEffect, useState } from "react";
import {
    AccountRecord,
    SponsorRecord,
    SponsorRequest,
} from "@nica-angels/shared";
import { Form, Formik, FormikErrors, FormikProps, Field } from "formik";
import * as yup from "yup";
import { useStoreState } from "../../store/_store";
import { FormError, LoadingSpinner } from "jack-hermanson-component-lib";
import { Button, Col, FormGroup, Input, Label, Row } from "reactstrap";
import { AccountClient } from "../../clients/AccountClient";
import { RESET_BUTTON_COLOR, SUBMIT_BUTTON_COLOR } from "../../utils/constants";

interface Props {
    onSubmit: (sponsorRequest: SponsorRequest) => Promise<void>;
    existingSponsor?: SponsorRecord;
}

export const CreateEditSponsorForm: FunctionComponent<Props> = ({
    onSubmit,
    existingSponsor,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const [accounts, setAccounts] = useState<AccountRecord[] | undefined>(
        undefined
    );

    useEffect(() => {
        if (token?.data) {
            AccountClient.getAccounts(token.data).then(data => {
                setAccounts(data);
            });
        }
    }, [setAccounts, token]);

    interface FormValues {
        accountId: string;
        firstName: string;
        lastName: string;
        email: string;
    }

    const validationSchema = yup.object().shape({
        accountId: yup
            .number()
            .optional()
            .integer()
            .positive()
            .label(spanish ? "Cuenta" : "Account"),
        firstName: yup
            .string()
            .required()
            .label(spanish ? "Nombre" : "First Name"),
        lastName: yup
            .string()
            .required()
            .label(spanish ? "Apellido" : "Last Name"),
        email: yup
            .string()
            .email()
            .required()
            .label(spanish ? "Correo Electrónico" : "Email"),
    });

    return (
        <Formik
            initialValues={{
                firstName: existingSponsor ? existingSponsor.firstName : "",
                lastName: existingSponsor ? existingSponsor.lastName : "",
                email: existingSponsor ? existingSponsor.email : "",
                accountId: existingSponsor?.accountId
                    ? existingSponsor.accountId.toString()
                    : "",
            }}
            onSubmit={async (data, { setSubmitting }) => {
                setSubmitting(true);
                await onSubmit({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    accountId: data.accountId
                        ? parseInt(data.accountId)
                        : undefined,
                });
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
                                <Col xs={12} lg={6}>
                                    {renderFirstName(errors)}
                                </Col>
                                <Col xs={12} lg={6}>
                                    {renderLastName(errors)}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} lg={6}>
                                    {renderEmail(errors)}
                                </Col>
                                <Col xs={12} lg={6}>
                                    {renderAccountId(errors)}
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

    function renderFirstName(errors: FormikErrors<FormValues>) {
        const id = "first-name-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    {spanish ? "Nombre" : "First Name"}
                </Label>
                <Field
                    as={Input}
                    id={id}
                    name="firstName"
                    type="text"
                    autoFocus={true}
                />
                <FormError>{errors.firstName}</FormError>
            </FormGroup>
        );
    }

    function renderLastName(errors: FormikErrors<FormValues>) {
        const id = "last-name-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    {spanish ? "Apellido" : "Last Name"}
                </Label>
                <Field as={Input} id={id} name="lastName" type="text" />
                <FormError>{errors.lastName}</FormError>
            </FormGroup>
        );
    }

    function renderEmail(errors: FormikErrors<FormValues>) {
        const id = "email-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    {spanish ? "Correo Electrónico" : "Email"}
                </Label>
                <Field as={Input} id={id} name="email" type="email" />
                <FormError>{errors.email}</FormError>
            </FormGroup>
        );
    }

    function renderAccountId(errors: FormikErrors<FormValues>) {
        const id = "account-id-input";
        return (
            <FormGroup>
                <Label className="form-label" for={id}>
                    {spanish ? "Cuenta" : "Account"}
                </Label>
                {!accounts ? (
                    <LoadingSpinner />
                ) : (
                    <Field id={id} name="accountId" type="select" as={Input}>
                        <option value="">
                            {spanish
                                ? "Elegir una cuenta..."
                                : "Select an account..."}
                        </option>
                        {accounts
                            .sort((a, b) => {
                                if (a.lastName > b.lastName) {
                                    return 1;
                                } else {
                                    return -1;
                                }
                            })
                            .map(account => (
                                <option key={account.id} value={account.id}>
                                    {account.firstName} {account.lastName} (
                                    {account.id})
                                </option>
                            ))}
                    </Field>
                )}
                <FormError>{errors.accountId}</FormError>
            </FormGroup>
        );
    }

    function renderButtons() {
        return (
            <div className="bottom-buttons">
                <Button type="submit" color={SUBMIT_BUTTON_COLOR}>
                    {spanish ? "Guardar" : "Save"}
                </Button>
                <Button type="reset" color={RESET_BUTTON_COLOR}>
                    {spanish ? "Restablecer" : "Reset"}
                </Button>
            </div>
        );
    }
};
