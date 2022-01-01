import { Fragment, FunctionComponent } from "react";
import { RegisterRequest } from "@nica-angels/shared";
import { Form, Formik, FormikErrors, FormikProps, Field } from "formik";
import * as yup from "yup";
import { FormError, LoadingSpinner } from "jack-hermanson-component-lib";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { RESET_BUTTON_COLOR, SUBMIT_BUTTON_COLOR } from "../../utils/constants";
import { useStoreState } from "../../store/_store";

interface Props {
    onSubmit: (requestBody: RegisterRequest) => Promise<void>;
}

const validationSchema = yup.object().shape({
    firstName: yup.string().label("First Name").required().min(2).max(100),
    lastName: yup.string().label("Last Name").required().min(2).max(100),
    email: yup.string().label("Email").email().required().max(100),
    password: yup.string().label("Password").required().min(3).max(100),
    confirmPassword: yup
        .string()
        .label("Confirm Password")
        .required()
        .test("passwords-match", "Passwords must match", function (value) {
            return this.parent.password === value;
        }),
});

interface FormValues extends RegisterRequest {
    confirmPassword: string;
}

export const RegisterForm: FunctionComponent<Props> = ({ onSubmit }: Props) => {
    const spanish = useStoreState(state => state.spanish);

    return (
        <Formik
            initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
            }}
            onSubmit={async (data, { setSubmitting }) => {
                setSubmitting(true);
                await onSubmit({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: data.password,
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
                            {renderFirstName(errors)}
                            {renderLastName(errors)}
                            {renderEmail(errors)}
                            {renderPassword(errors)}
                            {renderConfirmPassword(errors)}
                            {renderButtons()}
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
                    autoFocus={true}
                    name="firstName"
                    id={id}
                    type="text"
                    as={Input}
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
                <Field name="lastName" id={id} type="text" as={Input} />
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
                <Field name="email" id={id} type="text" as={Input} />
                <FormError>{errors.email}</FormError>
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
                <Field name="password" id={id} type="password" as={Input} />
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
                    name="confirmPassword"
                    id={id}
                    type="password"
                    as={Input}
                />
                <FormError>{errors.confirmPassword}</FormError>
            </FormGroup>
        );
    }

    function renderButtons() {
        return (
            <div className="bottom-buttons">
                <Button type="submit" color={SUBMIT_BUTTON_COLOR}>
                    {spanish ? "Registrar" : "Register"}
                </Button>
                <Button type="reset" color={RESET_BUTTON_COLOR}>
                    {spanish ? "Restablecer" : "Reset"}
                </Button>
            </div>
        );
    }
};
