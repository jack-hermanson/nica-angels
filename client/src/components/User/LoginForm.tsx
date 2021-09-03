import { Fragment, FunctionComponent } from "react";
import { LoginRequest } from "../../../../shared/resource_models/account";
import { Form, Formik, FormikErrors, FormikProps, Field } from "formik";
import * as yup from "yup";
import { FormError, LoadingSpinner } from "jack-hermanson-component-lib";
import { Button, FormGroup, Input, Label } from "reactstrap";

interface Props {
    onSubmit: (loginRequest: LoginRequest) => Promise<void>;
}

const validationSchema = yup.object().shape({
    email: yup.string().email().label("Email").required(),
    password: yup.string().label("Password").required(),
});

export const LoginForm: FunctionComponent<Props> = ({ onSubmit }: Props) => {
    return (
        <Formik
            initialValues={{
                email: "",
                password: "",
            }}
            onSubmit={async (data, { setSubmitting }) => {
                setSubmitting(true);
                await onSubmit({
                    email: data.email,
                    password: data.password,
                });
            }}
            validationSchema={validationSchema}
            validateOnBlur={false}
            validateOnChange={false}
        >
            {({ errors, isSubmitting }: FormikProps<LoginRequest>) => (
                <Form>
                    {isSubmitting ? (
                        <LoadingSpinner />
                    ) : (
                        <Fragment>
                            {renderEmail(errors)}
                            {renderPassword(errors)}
                            {renderButtons()}
                        </Fragment>
                    )}
                </Form>
            )}
        </Formik>
    );

    function renderEmail(errors: FormikErrors<LoginRequest>) {
        const id = "email-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    Email
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

    function renderPassword(errors: FormikErrors<LoginRequest>) {
        const id = "password-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    Password
                </Label>
                <Field name="password" id={id} type="password" as={Input} />
                <FormError>{errors.password}</FormError>
            </FormGroup>
        );
    }

    function renderButtons() {
        return (
            <div className="bottom-buttons">
                <Button type="submit" color="primary">
                    Log In
                </Button>
                <Button type="reset" color="secondary">
                    Reset
                </Button>
            </div>
        );
    }
};
