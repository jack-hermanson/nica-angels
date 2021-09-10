import { Fragment, FunctionComponent, useEffect, useState } from "react";
import {
    SchoolRecord,
    SchoolRequest,
} from "../../../../shared/resource_models/school";
import {
    Field,
    Form,
    Formik,
    FormikErrors,
    FormikHelpers,
    FormikProps,
} from "formik";
import { useStoreState } from "../../store/_store";
import * as yup from "yup";
import { FormError, LoadingSpinner } from "jack-hermanson-component-lib";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { RESET_BUTTON_COLOR, SUBMIT_BUTTON_COLOR } from "../../utils/constants";
import { TownRecord } from "../../../../shared/resource_models/town";
import { TownClient } from "../../clients/TownClient";

interface Props {
    onSubmit: (townRequest: SchoolRequest) => Promise<void>;
    existingSchool?: SchoolRecord;
}

interface FormValues {
    name: string;
    townId: string;
}

export const CreateEditSchoolForm: FunctionComponent<Props> = ({
    onSubmit,
    existingSchool,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const validationSchema = yup.object().shape({
        name: yup
            .string()
            .label(spanish ? "Nombre" : "Name")
            .required(
                spanish ? "Favor de registrar un nombre" : "Please enter a name"
            )
            .min(2)
            .max(40),
        townId: yup
            .number()
            .label(spanish ? "Pueblo" : "Town")
            .required(
                spanish ? "Favor de eligir un pueblo" : "Please select a town"
            ),
    });

    const [towns, setTowns] = useState<TownRecord[] | undefined>(undefined);

    useEffect(() => {
        if (token) {
            TownClient.getTowns(token.data).then(data => {
                setTowns(data);
            });
        }
    }, [setTowns, token]);

    return (
        <Formik
            initialValues={{
                name: existingSchool ? existingSchool.name : "",
                townId: existingSchool ? existingSchool.townId.toString() : "",
            }}
            onSubmit={async (data, { setSubmitting }) => {
                setSubmitting(true);
                await onSubmit({
                    townId: parseInt(data.townId),
                    name: data.name,
                });
            }}
            validationSchema={validationSchema}
            validateOnChange={false}
            validateOnBlur={false}
        >
            {({
                errors,
                isSubmitting,
                setFieldValue,
            }: FormikProps<FormValues>) => (
                <Form>
                    {isSubmitting ? (
                        <LoadingSpinner />
                    ) : (
                        <Fragment>
                            {renderName(errors)}
                            {renderTownId(errors)}
                            {renderButtons()}
                        </Fragment>
                    )}
                </Form>
            )}
        </Formik>
    );

    function renderName(errors: FormikErrors<FormValues>) {
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

    function renderTownId(errors: FormikErrors<FormValues>) {
        const id = "town-id-input";
        if (towns) {
            return (
                <FormGroup>
                    <Label className="form-label required" for={id}>
                        Town
                    </Label>
                    <Field id={id} name="townId" type="select" as={Input}>
                        <option value="">Please select...</option>
                        {towns.map(town => (
                            <option key={town.id} value={town.id}>
                                {town.name}
                            </option>
                        ))}
                    </Field>
                    <FormError>{errors.townId}</FormError>
                </FormGroup>
            );
        }
    }
};
