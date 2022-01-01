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
import { FormGroup, Input, Label } from "reactstrap";

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
                        <Fragment>{renderEmail(errors)}</Fragment>
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
};
