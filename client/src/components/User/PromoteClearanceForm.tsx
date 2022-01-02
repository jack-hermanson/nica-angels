import { Fragment, FunctionComponent } from "react";
import { AccountRecord, Clearance, PromoteRequest } from "@nica-angels/shared";
import { Form, Formik, FormikErrors, FormikProps, Field } from "formik";
import * as yup from "yup";
import { FormError, LoadingSpinner } from "jack-hermanson-component-lib";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { SUBMIT_BUTTON_COLOR } from "../../utils/constants";

interface Props {
    onSubmit: (promoteRequest: PromoteRequest) => Promise<void>;
    existingAccount: AccountRecord;
}

interface FormValues {
    clearance: string;
}

export const PromoteClearanceForm: FunctionComponent<Props> = ({
    onSubmit,
    existingAccount,
}: Props) => {
    const validationSchema = yup.object().shape({
        clearance: yup
            .number()
            .label("Clearance")
            .required()
            .min(Clearance.NONE)
            .max(Clearance.SUPER_ADMIN),
    });

    return (
        <Formik
            initialValues={{
                clearance: existingAccount.clearance.toString(),
            }}
            onSubmit={async (data, { setSubmitting }) => {
                setSubmitting(true);
                await onSubmit({
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
                            {renderClearance(errors)}
                            {renderButtons()}
                        </Fragment>
                    )}
                </Form>
            )}
        </Formik>
    );

    function renderClearance(errors: FormikErrors<FormValues>) {
        const id = "clearance-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    Clearance
                </Label>
                <Field name="clearance" id={id} type="select" as={Input}>
                    <option>Please select...</option>
                    <option value={Clearance.NONE}>None</option>
                    <option value={Clearance.SPONSOR}>Sponsor</option>
                    <option value={Clearance.ADMIN}>Admin</option>
                    <option value={Clearance.SUPER_ADMIN}>SuperAdmin</option>
                </Field>
                <FormError>{errors.clearance}</FormError>
            </FormGroup>
        );
    }

    function renderButtons() {
        return (
            <div className="bottom-buttons">
                <Button color={SUBMIT_BUTTON_COLOR} type="submit">
                    Submit
                </Button>
                <Button color="dark" type="reset">
                    Reset
                </Button>
            </div>
        );
    }
};
