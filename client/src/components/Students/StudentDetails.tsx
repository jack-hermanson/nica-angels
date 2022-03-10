import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import {
    getAge,
    SchoolRecord,
    sexToString,
    StudentRecord,
} from "@nica-angels/shared";
import { StudentClient } from "../../clients/StudentClient";
import { useStoreState } from "../../store/_store";
import { Card, CardBody, CardFooter, Col, Label, Row } from "reactstrap";
import {
    ActionCardHeader,
    KeyValCardBody,
    LoadingSpinner,
    PageHeader,
} from "jack-hermanson-component-lib";
import { UploadStudentImage } from "../Files/UploadStudentImage";
import { StudentBarcode } from "./StudentBarcode";
import { StudentImage } from "./StudentImage";
import { FaPencilAlt, FaPlus } from "react-icons/fa";
import { BUTTON_ICON_CLASSES, NEW_BUTTON_COLOR } from "../../utils/constants";
import { EnrollmentClient } from "../../clients/EnrollmentClient";
import { SchoolClient } from "../../clients/SchoolClient";
import moment from "moment";
import { StudentSponsorshipCard } from "./StudentSponsorshipCard";

interface Props extends RouteComponentProps<{ id: string }> {}

export const StudentDetails: FunctionComponent<Props> = ({
    match: {
        params: { id },
    },
}: Props) => {
    const [student, setStudent] = useState<StudentRecord | undefined>(
        undefined
    );
    const [school, setSchool] = useState<SchoolRecord | undefined>(undefined);
    const [enrollmentId, setEnrollmentId] = useState<undefined | number>(
        undefined
    );

    const token = useStoreState(state => state.token);
    const spanish = useStoreState(state => state.spanish);

    useEffect(() => {
        if (token) {
            StudentClient.getOne(parseInt(id), token.data).then(s => {
                setStudent(s);
            });
        }
    }, [id, setStudent, token]);

    useEffect(() => {
        if (token) {
            EnrollmentClient.getCurrentEnrollment(parseInt(id), token.data)
                .then(enrollmentData => {
                    if (enrollmentData) {
                        setEnrollmentId(enrollmentData.id);
                        SchoolClient.getOneSchool(
                            enrollmentData.schoolId,
                            token.data
                        ).then(schoolData => {
                            setSchool(schoolData);
                        });
                    }
                })
                .catch((error: any) => {
                    console.error(error);
                    console.error(error.response);
                });
        }
    }, [id, setSchool, token, setEnrollmentId]);

    return (
        <div>
            {student ? (
                <Fragment>
                    <Row>
                        <Col>
                            <PageHeader
                                title={`${student.firstName} ${
                                    student.middleName ? student.middleName : ""
                                } ${student.lastName ? student.lastName : ""}`}
                            >
                                <Link
                                    to={`/students/edit/${student.id}`}
                                    className={"btn btn-secondary btn-sm"}
                                >
                                    <FaPencilAlt
                                        className={BUTTON_ICON_CLASSES}
                                    />
                                    {spanish ? "Editar" : "Edit"}
                                </Link>
                            </PageHeader>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} lg={8} className="mb-3 mb-lg-0">
                            {renderInfo()}
                        </Col>
                        <Col xs={12} lg={4}>
                            {renderUploadImage()}
                            {renderBarcode()}
                        </Col>
                    </Row>
                </Fragment>
            ) : (
                <Fragment>
                    <Row>
                        <Col>
                            <PageHeader title="Student Details" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <LoadingSpinner />
                        </Col>
                    </Row>
                </Fragment>
            )}
        </div>
    );

    function renderInfo() {
        if (student) {
            return (
                <Fragment>
                    {renderName()}
                    {renderDemographicInfo()}
                    {renderEnrollment()}
                    {renderSponsorship()}
                </Fragment>
            );
        }
    }

    function renderUploadImage() {
        if (student) {
            return (
                <Card className="mb-3">
                    <ActionCardHeader
                        title={spanish ? "Subir Imagen" : "Upload Image"}
                    />
                    <CardBody>
                        <Row>
                            <Col xs={12} lg={9} className="mb-3 mb-lg-0">
                                {student.imageId && (
                                    <p>
                                        Uploading an image here will replace the
                                        current image.
                                    </p>
                                )}
                                <UploadStudentImage
                                    studentId={student.id}
                                    setNewFileId={newId => {
                                        setStudent(s => {
                                            return {
                                                ...s,
                                                imageId: newId,
                                            } as StudentRecord;
                                        });
                                    }}
                                />
                            </Col>
                            <Col xs={3} lg={3}>
                                <Label className="form-label">
                                    {spanish
                                        ? "Imagen Actual"
                                        : "Current Image"}
                                </Label>
                                <StudentImage imageId={student.imageId} />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            );
        }
    }

    function renderBarcode() {
        if (student) {
            return (
                <Card>
                    <ActionCardHeader
                        title={spanish ? "Código de Barras" : "Barcode"}
                    />
                    <CardBody>
                        <StudentBarcode student={student} />
                    </CardBody>
                </Card>
            );
        }
    }

    function renderDemographicInfo() {
        if (student) {
            return (
                <Card className="mb-3">
                    <ActionCardHeader
                        title={
                            spanish
                                ? "Información Demográfico"
                                : "Demographic Information"
                        }
                    />
                    <KeyValCardBody
                        keyValPairs={[
                            {
                                key: spanish
                                    ? "Fecha de Nacimiento"
                                    : "Date of Birth",
                                val: student.dateOfBirth
                                    ? moment(student.dateOfBirth)
                                          .toDate()
                                          .toLocaleDateString()
                                    : "",
                            },
                            {
                                key: spanish ? "Edad" : "Age",
                                val: getAge(student),
                            },
                            {
                                key: spanish ? "Sexo" : "Sex",
                                val: sexToString(student.sex, spanish),
                            },
                            {
                                key: spanish ? "Nivel" : "Level",
                                val: student.level,
                            },
                        ]}
                    />
                </Card>
            );
        }
    }

    function renderName() {
        if (student) {
            return (
                <Card className="mb-3">
                    <ActionCardHeader title={spanish ? "Nombre" : "Name"} />
                    <KeyValCardBody
                        keyValPairs={[
                            {
                                key: spanish ? "Nombre" : "First Name",
                                val: student.firstName,
                            },
                            {
                                key: spanish ? "Segundo Nombre" : "Middle Name",
                                val: student.middleName,
                            },
                            {
                                key: spanish ? "Apellido" : "Last Name",
                                val: student.lastName,
                            },
                        ]}
                    />
                </Card>
            );
        }
    }

    function renderEnrollment() {
        return (
            <Card className="mb-3">
                <ActionCardHeader title={spanish ? "Escuela" : "School"}>
                    <Link
                        to={`/settings/enrollments/new/${id}`}
                        className={`btn btn-sm btn-${NEW_BUTTON_COLOR}`}
                    >
                        <FaPlus className={BUTTON_ICON_CLASSES} />
                        {spanish ? "Nuevo Inscrito" : "New Enrollment"}
                    </Link>
                </ActionCardHeader>
                {school && enrollmentId ? (
                    <Fragment>
                        <KeyValCardBody
                            keyValPairs={[
                                {
                                    key: spanish ? "Escuela" : "School",
                                    val: (
                                        <Link
                                            className="ps-0"
                                            to={`/schools/edit/${school.id}`}
                                        >
                                            {school.name}
                                        </Link>
                                    ),
                                },
                            ]}
                        />
                        <CardFooter>
                            <Link
                                className="ps-0"
                                to={`/settings/enrollments/edit/${enrollmentId}`}
                            >
                                {spanish
                                    ? "Editar Inscrito"
                                    : "Edit Enrollment"}
                            </Link>
                        </CardFooter>
                    </Fragment>
                ) : (
                    <CardBody>
                        <p className="mb-0">
                            {spanish
                                ? "Este estudiante no tiene una escuela."
                                : "This student is not enrolled in school."}
                        </p>
                    </CardBody>
                )}
            </Card>
        );
    }

    function renderSponsorship() {
        if (student) {
            return (
                <StudentSponsorshipCard
                    studentId={student.id}
                    className="mb-0"
                />
            );
        }
    }
};
