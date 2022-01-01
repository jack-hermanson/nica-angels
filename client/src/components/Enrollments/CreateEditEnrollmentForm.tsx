import {
    EnrollmentRecord,
    EnrollmentRequest,
    SchoolRecord,
    StudentRecord,
} from "@nica-angels/shared";
import { Fragment, FunctionComponent, useEffect, useState } from "react";
import * as yup from "yup";
import { useStoreState } from "../../store/_store";
import { Field, Form, Formik, FormikErrors, FormikProps } from "formik";
import moment from "moment";
import { FormError, LoadingSpinner } from "jack-hermanson-component-lib";
import { Button, Col, FormGroup, Input, Label, Row } from "reactstrap";
import { StudentClient } from "../../clients/StudentClient";
import { SchoolClient } from "../../clients/SchoolClient";
import {
    DATE_FORMAT,
    RESET_BUTTON_COLOR,
    SUBMIT_BUTTON_COLOR,
} from "../../utils/constants";

interface Props {
    onSubmit: (enrollmentRequest: EnrollmentRequest) => Promise<void>;
    existingEnrollment?: EnrollmentRecord;
    studentId?: number;
}

export const CreateEditEnrollmentForm: FunctionComponent<Props> = ({
    onSubmit,
    existingEnrollment,
    studentId,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const [students, setStudents] = useState<StudentRecord[] | undefined>(
        undefined
    );
    const [schools, setSchools] = useState<SchoolRecord[] | undefined>(
        undefined
    );

    useEffect(() => {
        if (token) {
            StudentClient.getStudents(
                { skip: 0, take: 0, searchText: "", minLevel: 0, maxLevel: 12 },
                token.data
            ).then(data => {
                setStudents(data.items);
            });
            SchoolClient.getSchools(token.data).then(data => {
                setSchools(data);
            });
        }
    }, [setStudents, token]);

    interface FormValues {
        schoolId: string;
        studentId: string;
        startDate: string;
        endDate: string;
    }

    const validationSchema = yup.object().shape({
        schoolId: yup
            .number()
            .label(spanish ? "Escuela" : "School")
            .integer()
            .required(),
        studentId: yup
            .number()
            .label(spanish ? "Estudiante" : "Student")
            .integer()
            .required(),
        startDate: yup
            .string()
            .label(spanish ? "Fecha de Comienzo" : "Start Date")
            .optional(),
        endDate: yup
            .string()
            .label(spanish ? "Fecha de Cierre" : "End Date")
            .optional(),
    });

    return (
        <Formik
            initialValues={{
                schoolId: existingEnrollment
                    ? existingEnrollment.schoolId.toString()
                    : "",
                studentId: existingEnrollment
                    ? existingEnrollment.studentId.toString()
                    : studentId
                    ? studentId.toString()
                    : "",
                startDate: existingEnrollment?.startDate
                    ? moment(existingEnrollment.startDate).format(DATE_FORMAT)
                    : "",
                endDate: existingEnrollment?.endDate
                    ? moment(existingEnrollment.endDate).format(DATE_FORMAT)
                    : "",
            }}
            onSubmit={async (data, { setSubmitting }) => {
                setSubmitting(true);
                await onSubmit({
                    schoolId: parseInt(data.schoolId),
                    studentId: parseInt(data.studentId),
                    startDate: data.startDate
                        ? moment(data.startDate).toDate()
                        : undefined,
                    endDate: data.endDate
                        ? moment(data.endDate).toDate()
                        : undefined,
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
                            <Row>
                                <Col xs={12} lg={6}>
                                    {renderStudent(errors)}
                                </Col>
                                <Col xs={12} lg={6}>
                                    {renderSchool(errors)}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} lg={6}>
                                    {renderStartDate(errors)}
                                </Col>
                                <Col xs={12} lg={6}>
                                    {renderEndDate(errors)}
                                </Col>
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

    function renderStudent(errors: FormikErrors<FormValues>) {
        const id = "student-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    {spanish ? "Estudiante" : "Student"}
                </Label>
                {!students ? (
                    <LoadingSpinner />
                ) : (
                    <Field id={id} name="studentId" type="select" as={Input}>
                        <option value="">
                            {spanish
                                ? "Elegir un estudiante..."
                                : "Select a student..."}
                        </option>
                        {students
                            .sort((a, b) => {
                                if (a.firstName > b.firstName) {
                                    return 1;
                                }
                                return -1;
                            })
                            .map(student => (
                                <option key={student.id} value={student.id}>
                                    {student.firstName}{" "}
                                    {student.middleName || ""}{" "}
                                    {student.lastName || ""} (
                                    {spanish ? "Grado" : "Grade"}{" "}
                                    {student.level})
                                </option>
                            ))}
                    </Field>
                )}
                <FormError>{errors.studentId}</FormError>
            </FormGroup>
        );
    }

    function renderSchool(errors: FormikErrors<FormValues>) {
        const id = "school-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    {spanish ? "Escuela" : "School"}
                </Label>
                {!schools ? (
                    <LoadingSpinner />
                ) : (
                    <Field id={id} name="schoolId" type="select" as={Input}>
                        <option value="">
                            {spanish
                                ? "Elegir una escuela..."
                                : "Select a school..."}
                        </option>
                        {schools
                            .sort((a, b) => {
                                if (a.name > b.name) {
                                    return 1;
                                } else {
                                    return -1;
                                }
                            })
                            .map(school => (
                                <option key={school.id} value={school.id}>
                                    {school.name}
                                </option>
                            ))}
                    </Field>
                )}
                <FormError>{errors.schoolId}</FormError>
            </FormGroup>
        );
    }

    function renderStartDate(errors: FormikErrors<FormValues>) {
        const id = "start-date-input";
        return (
            <FormGroup>
                <Label for={id} className="form-label">
                    {spanish ? "Fecha de Comienzo" : "Start Date"}
                </Label>
                <Field type="date" id={id} as={Input} name="startDate" />
                <FormError>{errors.startDate}</FormError>
            </FormGroup>
        );
    }

    function renderEndDate(errors: FormikErrors<FormValues>) {
        const id = "end-date-input";
        return (
            <FormGroup>
                <Label for={id} className="form-label">
                    {spanish ? "Fecha de Cierre" : "End Date"}
                </Label>
                <Field type="date" id={id} as={Input} name="endDate" />
                <FormError>{errors.endDate}</FormError>
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
