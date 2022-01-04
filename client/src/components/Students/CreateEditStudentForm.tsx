import { Fragment, FunctionComponent } from "react";
import { StudentRecord, StudentRequest } from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";
import { Form, Formik, FormikErrors, FormikProps, Field } from "formik";
import * as yup from "yup";
import { FormError, LoadingSpinner } from "jack-hermanson-component-lib";
import { Sex } from "jack-hermanson-ts-utils";
import moment from "moment";
import { Button, Col, FormGroup, Input, Label, Row } from "reactstrap";
import {
    DATE_FORMAT,
    RESET_BUTTON_COLOR,
    SUBMIT_BUTTON_COLOR,
} from "../../utils/constants";

interface Props {
    onSubmit: (studentRequest: StudentRequest) => Promise<void>;
    existingStudent?: StudentRecord;
}

export const CreateEditStudentForm: FunctionComponent<Props> = ({
    onSubmit,
    existingStudent,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);

    const validationSchema = yup.object().shape({
        firstName: yup
            .string()
            .label(spanish ? "Nombre" : "Fist Name")
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
            .required(
                spanish ? "Favor de registrar un sexo" : "Please select a sex"
            )
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
        uniform: yup
            .boolean()
            .label(spanish ? "Uniforme" : "Uniform")
            .required(),
        schoolId: yup
            .number()
            .label(spanish ? "Escuela" : "School")
            .optional(),
    });

    interface FormValues {
        firstName: string;
        middleName: string;
        lastName: string;
        dateOfBirth: string;
        sex: string;
        level: string;
        backpack: boolean;
        shoes: boolean;
        supplies: boolean;
        uniform: boolean;
        schoolId: string;
    }

    return (
        <Formik
            initialValues={{
                firstName: existingStudent ? existingStudent.firstName : "",
                middleName: existingStudent?.middleName
                    ? existingStudent.middleName
                    : "",
                lastName: existingStudent?.lastName
                    ? existingStudent.lastName
                    : "",
                dateOfBirth: existingStudent?.dateOfBirth
                    ? moment(existingStudent.dateOfBirth).format(DATE_FORMAT)
                    : "",
                sex: existingStudent ? existingStudent.sex.toString() : "",
                level: existingStudent ? existingStudent.level.toString() : "",
                backpack: existingStudent ? existingStudent.backpack : false,
                shoes: existingStudent ? existingStudent.shoes : false,
                supplies: existingStudent ? existingStudent.supplies : false,
                uniform: existingStudent ? existingStudent.uniform : false,
                schoolId: "",
            }}
            onSubmit={async (data, { setSubmitting }) => {
                setSubmitting(true);
                await onSubmit({
                    firstName: data.firstName,
                    middleName: data.middleName || undefined,
                    lastName: data.lastName || undefined,
                    dateOfBirth: data.dateOfBirth
                        ? moment(data.dateOfBirth).toDate()
                        : undefined,
                    sex: parseInt(data.sex),
                    level: parseInt(data.level),
                    backpack: data.backpack,
                    shoes: data.shoes,
                    supplies: data.supplies,
                    uniform: data.uniform,
                });
            }}
            validationSchema={validationSchema}
            validateOnBlur={false}
            validateOnChange={false}
        >
            {({ errors, isSubmitting }: FormikProps<FormValues>) => (
                <Form>
                    {isSubmitting ? (
                        <LoadingSpinner />
                    ) : (
                        <Fragment>
                            <Row>
                                <Col xs={12} lg={4}>
                                    {renderFirstName(errors)}
                                </Col>
                                <Col xs={12} lg={4}>
                                    {renderMiddleName(errors)}
                                </Col>
                                <Col xs={12} lg={4}>
                                    {renderLastName(errors)}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} lg={4}>
                                    {renderDateOfBirth(errors)}
                                </Col>
                                <Col xs={12} lg={4}>
                                    {renderSex(errors)}
                                </Col>
                                <Col xs={12} lg={4}>
                                    {renderLevel(errors)}
                                </Col>
                            </Row>
                            <Row>
                                <Col>{renderGeneralSupplies()}</Col>
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
        const id = "first-name";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    {spanish ? "Nombre" : "First Name"}
                </Label>
                <Field name="firstName" id={id} as={Input} autoFocus={true} />
                <FormError>{errors.firstName}</FormError>
            </FormGroup>
        );
    }

    function renderMiddleName(errors: FormikErrors<FormValues>) {
        const id = "middle-name";
        return (
            <FormGroup>
                <Label className="form-label" for={id}>
                    {spanish ? "Segundo Nombre" : "Middle Name"}
                </Label>
                <Field name="middleName" id={id} as={Input} />
                <FormError>{errors.middleName}</FormError>
            </FormGroup>
        );
    }

    function renderLastName(errors: FormikErrors<FormValues>) {
        const id = "last-name";
        return (
            <FormGroup>
                <Label className="form-label" for={id}>
                    {spanish ? "Apellido" : "Last Name"}
                </Label>
                <Field name="lastName" id={id} as={Input} />
                <FormError>{errors.lastName}</FormError>
            </FormGroup>
        );
    }

    function renderDateOfBirth(errors: FormikErrors<FormValues>) {
        const id = "date-of-birth";
        return (
            <FormGroup>
                <Label className="form-label" for={id}>
                    {spanish ? "Fecha de Nacimiento" : "Date of Birth"}
                </Label>
                <Field type="date" name="dateOfBirth" id={id} as={Input} />
                <FormError>{errors.dateOfBirth}</FormError>
            </FormGroup>
        );
    }

    function renderSex(errors: FormikErrors<FormValues>) {
        const id = "sex-input";
        return (
            <FormGroup>
                <Label for={id} className="form-label required">
                    {spanish ? "Sexo" : "Sex"}
                </Label>
                <Field type="select" name="sex" id={id} as={Input}>
                    <option value="">
                        {spanish ? "Elegir un sexo..." : "Select a sex..."}
                    </option>
                    <option value={Sex.MALE}>
                        {spanish ? "Varón" : "Male"} ♂
                    </option>
                    <option value={Sex.FEMALE}>
                        {spanish ? "Mujer" : "Female"} ♀
                    </option>
                </Field>
                <FormError>{errors.sex}</FormError>
            </FormGroup>
        );
    }

    function renderLevel(errors: FormikErrors<FormValues>) {
        const id = "level-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    {spanish ? "Nivel" : "Grade Level"}
                </Label>
                <Field
                    placeholder={`0 = ${spanish ? "preescolar" : "preschool"}`}
                    name="level"
                    type="number"
                    id={id}
                    as={Input}
                />
                <FormError>{errors.level}</FormError>
            </FormGroup>
        );
    }

    function renderGeneralSupplies() {
        return (
            <FormGroup>
                <Label className="form-label">
                    {spanish ? "Suministros" : "Supplies"}
                </Label>
                {renderBackpack()}
                {renderShoes()}
                {renderSupplies()}
                {renderUniform()}
            </FormGroup>
        );
    }

    function renderBackpack() {
        const id = "backpack-input";
        return (
            <FormGroup check>
                <Field id={id} type="checkbox" name="backpack" as={Input} />
                <Label className="form-check-label" for={id}>
                    {spanish ? "Mochila" : "Backpack"}
                </Label>
            </FormGroup>
        );
    }

    function renderShoes() {
        const id = "shoes-input";
        return (
            <FormGroup check>
                <Field id={id} type="checkbox" name="shoes" as={Input} />
                <Label className="form-check-label" for={id}>
                    {spanish ? "Zapatos" : "Shoes"}
                </Label>
            </FormGroup>
        );
    }

    function renderSupplies() {
        const id = "supplies-input";
        return (
            <FormGroup check>
                <Field id={id} type="checkbox" name="supplies" as={Input} />
                <Label className="form-check-label" for={id}>
                    {spanish ? "Útiles" : "School Supplies"}
                </Label>
            </FormGroup>
        );
    }

    function renderUniform() {
        const id = "uniform-input";
        return (
            <FormGroup check>
                <Field id={id} type="checkbox" name="uniform" as={Input} />
                <Label className="form-check-label" for={id}>
                    {spanish ? "Uniforme" : "Uniform"}
                </Label>
            </FormGroup>
        );
    }

    function renderButtons() {
        return (
            <div className="bottom-buttons">
                <Button color={SUBMIT_BUTTON_COLOR} type="submit">
                    {spanish ? "Guardar" : "Save"}
                </Button>
                <Button color={RESET_BUTTON_COLOR} type="reset">
                    {spanish ? "Restablecer" : "Reset"}
                </Button>
            </div>
        );
    }
};
