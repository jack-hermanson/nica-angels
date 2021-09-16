import { Fragment, FunctionComponent } from "react";
import {
    StudentRecord,
    StudentRequest,
} from "../../../../shared/resource_models/student";
import { useStoreState } from "../../store/_store";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { LoadingSpinner } from "jack-hermanson-component-lib";
import { Sex } from "jack-hermanson-ts-utils";

interface Props {
    onSubmit: (studentRequest: StudentRequest) => Promise<void>;
    existingStudent?: StudentRecord;
}

export const CreateEditStudentForm: FunctionComponent<Props> = ({
    onSubmit,
    existingStudent,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const validationSchema = yup.object().shape({
        firstName: yup
            .string()
            .label(spanish ? "Nombre" : "Name")
            .required(
                spanish ? "Favor de registrar un nombre" : "Please enter a name"
            ),
        middleName: yup
            .string()
            .label(spanish ? "Segundo Nombre" : "Middle Name")
            .optional(),
        lastName: yup
            .string()
            .label(spanish ? "Apellido" : "Last Name")
            .optional(),
        dateOfBirth: yup
            .string()
            .label(spanish ? "Fecha de Nacimiento" : "Date of Birth")
            .optional(),
        sex: yup
            .number()
            .integer()
            .label(spanish ? "Sexo" : "Sex")
            .required()
            .min(Sex.FEMALE)
            .max(Sex.MALE),
        level: yup
            .number()
            .integer()
            .label(spanish ? "Nivel" : "Level")
            .required()
            .min(0)
            .max(12),
        backpack: yup
            .boolean()
            .label(spanish ? "Mochila" : "Backpack")
            .required(),
        shoes: yup
            .boolean()
            .label(spanish ? "Zapatos" : "Shoes")
            .required(),
        supplies: yup
            .boolean()
            .label(spanish ? "Útiles" : "School Supplies")
            .required(),
    });

    return (
        <Formik
            initialValues={{}}
            onSubmit={async (data, { setSubmitting }) => {
                setSubmitting(true);
                await onSubmit({});
            }}
            validationSchema={}
            validateOnBlur={false}
            validateOnChange={false}
        >
            {({ errors, isSubmitting }) => (
                <Form>
                    {isSubmitting ? <LoadingSpinner /> : <Fragment></Fragment>}
                </Form>
            )}
        </Formik>
    );
};
