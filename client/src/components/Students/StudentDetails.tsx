import { FunctionComponent, Fragment, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { getAge, sexToString, StudentRecord } from "@nica-angels/shared";
import { StudentClient } from "../../clients/StudentClient";
import { useStoreState } from "../../store/_store";
import { Card, CardBody, Col, Label, Row } from "reactstrap";
import {
    ActionCardHeader,
    KeyValCardBody,
    LoadingSpinner,
    PageHeader,
} from "jack-hermanson-component-lib";
import { UploadStudentImage } from "../Files/UploadStudentImage";
import { StudentBarcode } from "./StudentBarcode";
import { StudentImage } from "./StudentImage";
import { Link } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import { BUTTON_ICON_CLASSES } from "../../utils/constants";

interface Props extends RouteComponentProps<{ id: string }> {}

export const StudentDetails: FunctionComponent<Props> = ({
    match: {
        params: { id },
    },
}: Props) => {
    const [student, setStudent] = useState<StudentRecord | undefined>(
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
                    <pre className="alert alert-secondary mb-0">
                        TODO: school and sponsor info
                    </pre>
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
                            <Col xs={2} lg={3}>
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
                                    ? new Date(
                                          student.dateOfBirth
                                      ).toLocaleDateString()
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
};
