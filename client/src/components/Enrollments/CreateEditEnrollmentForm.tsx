import { StudentRecord } from "../../../../shared/resource_models/student";
import { Fragment, FunctionComponent, useEffect, useState } from "react";
import {
    EnrollmentRecord,
    EnrollmentRequest,
} from "../../../../shared/resource_models/enrollment";
import * as yup from "yup";
import { useStoreState } from "../../store/_store";
import { Form, Formik, FormikErrors, FormikProps, Field } from "formik";
import moment from "moment";
import { LoadingSpinner } from "jack-hermanson-component-lib";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { StudentClient } from "../../clients/StudentClient";

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

    useEffect(() => {
        if (token) {
            StudentClient.getStudents(token.data).then(data => {
                setStudents(data);
            });
        }
    }, [setStudents, token]);

    interface FormValues {
        schoolId: "" | number;
        studentId: "" | number;
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
                schoolId: existingEnrollment ? existingEnrollment.schoolId : "",
                studentId: existingEnrollment
                    ? existingEnrollment.studentId
                    : studentId
                    ? studentId
                    : "",
                startDate: "",
                endDate: "",
            }}
            onSubmit={async (data, { setSubmitting }) => {
                setSubmitting(true);
                await onSubmit({
                    schoolId: data.schoolId as number,
                    studentId: data.studentId as number,
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
                                    {student.firstName} {student.lastName || ""}{" "}
                                    ({spanish ? "Grado" : "Grade"}{" "}
                                    {student.level})
                                </option>
                            ))}
                    </Field>
                )}
            </FormGroup>
        );
    }
};
