import { Fragment, FunctionComponent, useEffect, useState } from "react";
import {
    SponsorRecord,
    SponsorshipRecord,
    SponsorshipRequest,
    StudentRecord,
} from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";
import { StudentClient } from "../../clients/StudentClient";
import { SponsorClient } from "../../clients/SponsorClient";
import {
    DATE_FORMAT,
    RESET_BUTTON_COLOR,
    SUBMIT_BUTTON_COLOR,
} from "../../utils/constants";
import * as yup from "yup";
import moment from "moment";
import { Formik, Form, Field, FormikErrors, FormikProps } from "formik";
import { FormError, LoadingSpinner } from "jack-hermanson-component-lib";
import {
    Col,
    FormGroup,
    Input,
    InputGroup,
    Label,
    Row,
    InputGroupText,
    Button,
} from "reactstrap";

interface Props {
    onSubmit: (sponsorshipRequest: SponsorshipRequest) => Promise<void>;
    existingSponsorship?: SponsorshipRecord;
}

export const CreateEditSponsorshipForm: FunctionComponent<Props> = ({
    onSubmit,
    existingSponsorship,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const [students, setStudents] = useState<StudentRecord[] | undefined>(
        undefined
    );
    const [sponsors, setSponsors] = useState<SponsorRecord[] | undefined>(
        undefined
    );

    useEffect(() => {
        if (token) {
            StudentClient.getStudents(
                {
                    minLevel: 0,
                    maxLevel: 12,
                    skip: 0,
                    take: 0,
                    searchText: "",
                },
                token.data
            ).then(data => {
                setStudents(data.items);
            });

            SponsorClient.getAll(token.data).then(data => {
                setSponsors(data);
            });
        }
    }, [token, setStudents, setSponsors]);

    interface FormValues {
        studentId: string;
        sponsorId: string;
        startDate: string;
        endDate: string;
        payment: string;
        frequency: string;
    }

    const validationSchema = yup.object().shape({
        studentId: yup
            .number()
            .required()
            .integer()
            .positive()
            .label(spanish ? "Estudiante" : "Student"),
        sponsorId: yup
            .number()
            .required()
            .integer()
            .positive()
            .label(spanish ? "Padrino" : "Sponsor"),
        startDate: yup
            .string()
            .required()
            .label(spanish ? "Fecha de Comienzo" : "Start Date"),
        endDate: yup
            .string()
            .optional()
            .label(spanish ? "Fecha de Cierre" : "End Date"),
        payment: yup
            .number()
            .required()
            .positive()
            .label(spanish ? "Pago" : "Payment"),
        frequency: yup
            .number()
            .required()
            .positive()
            .label(spanish ? "Frecuencia" : "Frequency"),
    });

    return (
        <Formik
            initialValues={{
                studentId: existingSponsorship
                    ? existingSponsorship.studentId.toString()
                    : "",
                sponsorId: existingSponsorship
                    ? existingSponsorship.sponsorId.toString()
                    : "",
                startDate: existingSponsorship
                    ? moment(existingSponsorship.startDate).format(DATE_FORMAT)
                    : "",
                endDate: existingSponsorship?.endDate
                    ? moment(existingSponsorship.endDate).format(DATE_FORMAT)
                    : "",
                payment: existingSponsorship
                    ? existingSponsorship.payment.toString()
                    : "",
                frequency: existingSponsorship
                    ? existingSponsorship.frequency.toString()
                    : "",
            }}
            onSubmit={async (data, { setSubmitting }) => {
                setSubmitting(true);
                await onSubmit({
                    studentId: parseInt(data.studentId),
                    sponsorId: parseInt(data.sponsorId),
                    startDate: moment(data.startDate).toDate(),
                    endDate: data.endDate
                        ? moment(data.endDate).toDate()
                        : undefined,
                    payment: parseInt(data.payment),
                    frequency: parseInt(data.frequency),
                });
            }}
            validationSchema={validationSchema}
            validateOnChange={false}
            validateOnBlur={false}
        >
            {({ errors, isSubmitting }: FormikProps<FormValues>) => (
                <Form>
                    {isSubmitting || !students || !sponsors ? (
                        <LoadingSpinner />
                    ) : (
                        <Fragment>
                            <Row>
                                <Col xs={12} lg={6}>
                                    {renderStudent(errors)}
                                </Col>
                                <Col xs={12} lg={6}>
                                    {renderSponsor(errors)}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} lg={6}>
                                    {renderPayment(errors)}
                                </Col>
                                <Col xs={12} lg={6}>
                                    {renderFrequency(errors)}
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

        if (students) {
            return (
                <FormGroup>
                    <Label className="form-label required" for={id}>
                        {spanish ? "Estudiante" : "Student"}
                    </Label>
                    <Field id={id} name="studentId" type="select" as={Input}>
                        <option value="">
                            {spanish
                                ? "Elegir un estudiante..."
                                : "Select a student..."}
                        </option>
                        {students
                            .sort((a, b) =>
                                a.firstName > b.firstName ? 1 : -1
                            )
                            .map(student => (
                                <option key={student.id} value={student.id}>
                                    {student.firstName}{" "}
                                    {student.middleName || ""}{" "}
                                    {student.lastName || ""} (
                                    {spanish ? "Grado" : "Grade"}{" "}
                                    {student.level} - ID #{student.id})
                                </option>
                            ))}
                        <FormError>{errors.studentId}</FormError>
                    </Field>
                </FormGroup>
            );
        }
    }

    function renderSponsor(errors: FormikErrors<FormValues>) {
        const id = "sponsor-input";
        if (sponsors) {
            return (
                <FormGroup>
                    <Label className="form-label required" for={id}>
                        {spanish ? "Padrino" : "Sponsor"}
                    </Label>
                    <Field id={id} name="sponsorId" type="select" as={Input}>
                        <option value="">
                            {spanish
                                ? "Elegir un padrino..."
                                : "Select a sponsor..."}
                        </option>
                        {sponsors
                            .sort((a, b) => (a.lastName > b.lastName ? 1 : -1))
                            .map(sponsor => (
                                <option key={sponsor.id} value={sponsor.id}>
                                    {sponsor.firstName} {sponsor.lastName} (ID #
                                    {sponsor.id})
                                </option>
                            ))}
                    </Field>
                    <FormError>{errors.sponsorId}</FormError>
                </FormGroup>
            );
        }
    }

    function renderPayment(errors: FormikErrors<FormValues>) {
        const id = "payment-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    {spanish ? "Pago" : "Payment"}
                </Label>
                <InputGroup>
                    <InputGroupText>$</InputGroupText>
                    <Field id={id} name="payment" type="number" as={Input} />
                </InputGroup>
                <FormError>{errors.payment}</FormError>
            </FormGroup>
        );
    }

    function renderFrequency(errors: FormikErrors<FormValues>) {
        const id = "frequency-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    {spanish ? "Frecuencia" : "Frequency"}
                </Label>
                <Field id={id} name="frequency" type="select" as={Input}>
                    <option value="">
                        {spanish
                            ? "Elegir una frecuencia"
                            : "Select a frequency..."}
                    </option>
                    <option value="1">
                        {spanish ? "Anualmente (1/año)" : "Annually (1/year)"}
                    </option>
                    <option value="4">
                        {spanish ? "Trimestral (4/año)" : "Quarterly (4/year)"}
                    </option>
                </Field>
                <FormError>{errors.frequency}</FormError>
            </FormGroup>
        );
    }

    function renderStartDate(errors: FormikErrors<FormValues>) {
        const id = "start-date-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
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
                <Label className="form-label" for={id}>
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
