import { Fragment, FunctionComponent } from "react";
import { StudentRecord } from "../../../../shared";
import { Card, CardBody, CardFooter, Col, Row, Table } from "reactstrap";
import { ActionCardHeader, KeyValTable } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { Clearance } from "../../../../shared";
import { Link } from "react-router-dom";
import moment from "moment";
import { Sex } from "jack-hermanson-ts-utils";
import { SchoolRecord } from "../../../../shared";
import { StudentImage } from "./StudentImage";

interface Props {
    student: StudentRecord;
    school?: SchoolRecord;
}

export const Student: FunctionComponent<Props> = ({
    student,
    school,
}: Props) => {
    const currentUser = useStoreState(state => state.currentUser);
    const spanish = useStoreState(state => state.spanish);

    return (
        <Card className="mb-3 no-mb-last">
            <ActionCardHeader
                title={`Student #${String(student.id).padStart(3, "0")}`}
            />
            <CardBody>
                <Row>
                    <Col xs={4} lg={3} className="mb-3 mb-lg-0">
                        <StudentImage imageId={student.imageId} />
                    </Col>
                    <Col xs={12} lg={9}>
                        <h4>
                            {student.firstName} {student.middleName || ""}{" "}
                            {student.lastName || ""}
                        </h4>
                        <KeyValTable
                            keyValPairs={[
                                {
                                    key: spanish
                                        ? "Fecha de Nacimiento"
                                        : "Date of Birth",
                                    val: renderDateOfBirth(),
                                },
                                {
                                    key: spanish ? "Nivel" : "Level",
                                    val:
                                        student.level === 0
                                            ? spanish
                                                ? "Preescolar"
                                                : "Preschool"
                                            : student.level,
                                },
                                {
                                    key: spanish ? "Suministros" : "Supplies",
                                    val: listSupplies().join(", "),
                                },
                                {
                                    key: spanish ? "Sexo" : "Sex",
                                    val: Sex[student.sex]
                                        .toLowerCase()
                                        .capitalizeFirst(),
                                },
                                {
                                    key: spanish ? "Escuela" : "School",
                                    val: "TODO",
                                },
                                {
                                    key: spanish ? "Padrino" : "Sponsor",
                                    val: "TODO",
                                },
                            ]}
                        />
                    </Col>
                </Row>
            </CardBody>
            {renderFooter()}
        </Card>
    );

    function listSupplies() {
        const supplies: string[] = [];
        if (student.backpack) {
            supplies.push(spanish ? "Mochila" : "Backpack");
        }
        if (student.shoes) {
            supplies.push(spanish ? "Zapatos" : "Shoes");
        }
        if (student.supplies) {
            supplies.push(spanish ? "Útiles" : "School Supplies");
        }
        if (student.uniform) {
            supplies.push(spanish ? "Uniforme" : "Uniform");
        }
        return supplies;
    }

    function renderFooter() {
        if (currentUser && currentUser.clearance >= Clearance.ADMIN) {
            return (
                <CardFooter className="d-flex">
                    <Link to={`/students/edit/${student.id}`}>
                        {spanish ? "Editar" : "Edit"}
                    </Link>
                    <Link
                        className="ms-auto"
                        to={`/settings/enrollments/new/${student.id}`}
                    >
                        {spanish ? "Inscribir" : "Enroll"}
                    </Link>
                </CardFooter>
            );
        }
    }

    function renderDateOfBirth() {
        const dateOfBirth: Date | undefined = student.dateOfBirth
            ? moment(student.dateOfBirth).toDate()
            : undefined;
        const yearsOld: number | undefined = dateOfBirth
            ? new Date().getFullYear() - dateOfBirth.getFullYear()
            : undefined;
        return (
            <Fragment>
                {dateOfBirth?.toLocaleDateString() || "N/A"}{" "}
                {yearsOld && `(${spanish ? "edad" : "age"} ${yearsOld})`}
            </Fragment>
        );
    }
};
