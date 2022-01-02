import { Fragment, FunctionComponent } from "react";
import {
    AccountRecord,
    AdminEditAccountRequest,
    Clearance,
} from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";
import * as yup from "yup";
import { Form, Formik, FormikErrors, FormikProps, Field } from "formik";
import { FormError, LoadingSpinner } from "jack-hermanson-component-lib";
import { Button, FormGroup, FormText, Input, Label } from "reactstrap";
import { RESET_BUTTON_COLOR, SUBMIT_BUTTON_COLOR } from "../../utils/constants";

interface Props {
    onSubmit: (
        adminEditAccountRequest: AdminEditAccountRequest
    ) => Promise<void>;
    callback?: () => any;
    existingRecord?: AccountRecord;
}

interface FormValues {
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    confirmPassword?: string;
    clearance: string;
}

export const AdminEditUserForm: FunctionComponent<Props> = ({
    onSubmit,
    callback,
    existingRecord,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);

    const validationSchema = yup.object().shape({
        email: yup
            .string()
            .email()
            .label(spanish ? "Correo electrónico" : "Email")
            .required(),
        firstName: yup
            .string()
            .label(spanish ? "Nombre" : "First Name")
            .required(),
        lastName: yup
            .string()
            .label(spanish ? "Apellido" : "Last Name")
            .required(),
        password: yup
            .string()
            .label(spanish ? "Contraseña" : "Password")
            .optional(),
        confirmPassword: yup
            .string()
            .label(spanish ? "Confirmar Contraseña" : "Confirm Password")
            .optional()
            .test("passwords-match", "Passwords must match", function (value) {
                return this.parent.password === value;
            }),
        clearance: yup
            .number()
            .label(spanish ? "Autorización" : "Clearance")
            .min(Clearance.NONE)
            .max(Clearance.SUPER_ADMIN)
            .required(),
    });

    return (
        <Formik
            initialValues={{
                email: existingRecord ? existingRecord.email : "",
                firstName: existingRecord ? existingRecord.firstName : "",
                lastName: existingRecord ? existingRecord.lastName : "",
                password: "",
                confirmPassword: "",
                clearance: existingRecord
                    ? existingRecord.clearance.toString()
                    : "",
            }}
            onSubmit={async (data, { setSubmitting }) => {
                setSubmitting(true);
                await onSubmit({
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    password: data.password.length ? data.password : undefined,
                    clearance: parseInt(data.clearance),
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
                            {renderEmail(errors)}
                            {renderFirstName(errors)}
                            {renderLastName(errors)}
                            {renderClearance(errors)}
                            {renderPassword(errors)}
                            {renderConfirmPassword(errors)}
                            {renderButtons()}
                        </Fragment>
                    )}
                </Form>
            )}
        </Formik>
    );

    function renderEmail(errors: FormikErrors<FormValues>) {
        const id = "email-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    {spanish ? "Correo Electrónico" : "Email"}
                </Label>
                <Field
                    autoFocus={true}
                    name="email"
                    id={id}
                    type="text"
                    as={Input}
                />
                <FormError>{errors.email}</FormError>
            </FormGroup>
        );
    }

    function renderFirstName(errors: FormikErrors<FormValues>) {
        const id = "first-name-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    {spanish ? "Nombre" : "First Name"}
                </Label>
                <Field name="firstName" id={id} type="text" as={Input} />
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
                <Field name="lastName" id={id} type="text" as={Input} />
                <FormError>{errors.lastName}</FormError>
            </FormGroup>
        );
    }

    function renderClearance(errors: FormikErrors<FormValues>) {
        const id = "clearance-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    {spanish ? "Autorización" : "Clearance"}
                </Label>
                <Field name="clearance" id={id} type="select" as={Input}>
                    <option>
                        {spanish ? "Favor de elegir..." : "Please select..."}
                    </option>
                    <option value={Clearance.NONE}>
                        {spanish ? "Ninguna" : "None"}
                    </option>
                    <option value={Clearance.SPONSOR}>
                        {spanish ? "Padrino" : "Sponsor"}
                    </option>
                    {existingRecord &&
                        existingRecord.clearance >= Clearance.ADMIN && (
                            <Fragment>
                                <option value={Clearance.ADMIN}>Admin</option>
                                <option value={Clearance.SUPER_ADMIN}>
                                    SuperAdmin
                                </option>
                            </Fragment>
                        )}
                </Field>
                <FormText>
                    Promoting to admin clearance is not available in this form.
                </FormText>
                <FormError>{errors.clearance}</FormError>
            </FormGroup>
        );
    }

    function renderPassword(errors: FormikErrors<FormValues>) {
        const id = "password-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    {spanish ? "Contraseña" : "Password"}
                </Label>
                <Field
                    placeholder="Leave field blank to keep the same password"
                    id={id}
                    as={Input}
                    name="password"
                    type="password"
                />
                <FormError>{errors.password}</FormError>
            </FormGroup>
        );
    }

    function renderConfirmPassword(errors: FormikErrors<FormValues>) {
        const id = "confirm-password-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    {spanish ? "Confirmar Contraseña" : "Confirm Password"}
                </Label>
                <Field
                    id={id}
                    as={Input}
                    name="confirmPassword"
                    type="password"
                />
                <FormError>{errors.confirmPassword}</FormError>
            </FormGroup>
        );
    }

    function renderButtons() {
        return (
            <div className="bottom-buttons">
                <Button type="submit" color={SUBMIT_BUTTON_COLOR}>
                    {spanish ? "Entregar" : "Submit"}
                </Button>
                <Button type="reset" color={RESET_BUTTON_COLOR}>
                    {spanish ? "Restablecer" : "Reset"}
                </Button>
            </div>
        );
    }
};
