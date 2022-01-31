import { Fragment, FunctionComponent } from "react";
import { SponsorRecord, SponsorRequest } from "@nica-angels/shared";
import { Form, Formik, FormikErrors, FormikProps, Field } from "formik";
import * as yup from "yup";
import { useStoreState } from "../../store/_store";
import { FormError, LoadingSpinner } from "jack-hermanson-component-lib";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";

interface Props {
    onSubmit: (sponsorRequest: SponsorRequest) => Promise<void>;
    existingSponsor?: SponsorRecord;
}

export const CreateEditSponsorForm: FunctionComponent<Props> = ({
    onSubmit,
    existingSponsor,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);

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
            onSubmit={async (data, { setSubmitting }) => {}}
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
};
