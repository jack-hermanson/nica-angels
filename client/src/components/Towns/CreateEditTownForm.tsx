import { Fragment, FunctionComponent } from "react";
import {
    TownRecord,
    TownRequest,
} from "../../../../shared/resource_models/town";
import { Form, Formik, FormikErrors, FormikProps, Field } from "formik";
import * as yup from "yup";
import { FormError, LoadingSpinner } from "jack-hermanson-component-lib";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { RESET_BUTTON_COLOR, SUBMIT_BUTTON_COLOR } from "../../utils/constants";
import { useStoreState } from "../../store/_store";

interface Props {
    onSubmit: (townRequest: TownRequest) => Promise<void>;
    existingTown?: TownRecord;
}

export const CreateEditTownForm: FunctionComponent<Props> = ({
    onSubmit,
    existingTown,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);

    const validationSchema = yup.object().shape({
        name: yup
            .string()
            .label(spanish ? "Nombre" : "Name")
            .required(
                spanish ? "Favor de ingresar un nombre" : "Please enter a name"
            )
            .min(2)
            .max(25),
    });

    return (
        <Formik
            initialValues={{
                name: existingTown ? existingTown.name : "",
            }}
            onSubmit={async (data, { setSubmitting }) => {
                setSubmitting(true);
                await onSubmit({
                    name: data.name,
                });
            }}
            validationSchema={validationSchema}
            validateOnChange={false}
            validateOnBlur={false}
        >
            {({ errors, isSubmitting }: FormikProps<TownRequest>) => (
                <Form>
                    {isSubmitting ? (
                        <LoadingSpinner />
                    ) : (
                        <Fragment>
                            {renderName(errors)}
                            {renderButtons()}
                        </Fragment>
                    )}
                </Form>
            )}
        </Formik>
    );

    function renderName(errors: FormikErrors<TownRequest>) {
        const id = "name-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    {spanish ? "Nombre" : "Name"}
                </Label>
                <Field
                    autoFocus={true}
                    name="name"
                    id={id}
                    type="text"
                    as={Input}
                />
                <FormError>{errors.name}</FormError>
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
