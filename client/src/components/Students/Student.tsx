import { Fragment, FunctionComponent } from "react";
import { StudentRecord } from "../../../../shared";
import { Card, CardBody, CardFooter, Col, Row } from "reactstrap";
import { ActionCardHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { Clearance } from "../../../../shared";
import { Link } from "react-router-dom";
import moment from "moment";
import { Sex } from "jack-hermanson-ts-utils";
import { SchoolRecord } from "../../../../shared";

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
                title={`${student.firstName} ${student.middleName || ""} ${
                    student.lastName || ""
                }`}
            />
            <CardBody>
                <Row>
                    <Col xs={12} lg={6} className="mb-3">
                        <dl>
                            <dt>
                                {spanish
                                    ? "Fecha de Nacimiento"
                                    : "Date of Birth"}
                            </dt>
                            <dd>{renderDateOfBirth()}</dd>
                        </dl>
                    </Col>
                    <Col xs={12} lg={6} className="mb-3">
                        <dl>
                            <dt>{spanish ? "Nivel" : "Level"}</dt>
                            <dd>
                                {student.level === 0
                                    ? spanish
                                        ? "Preescolar"
                                        : "Preschool"
                                    : student.level}
                            </dd>
                        </dl>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} lg={6} className="mb-3">
                        <dl>
                            <dt>{spanish ? "Suministros" : "Supplies"}</dt>
                            <dd>{listSupplies().join(", ") || "N/A"}</dd>
                        </dl>
                    </Col>
                    <Col xs={12} lg={6} className="mb-3">
                        <dl>
                            <dt>{spanish ? "Sexo" : "Sex"}</dt>
                            <dd>
                                {Sex[student.sex]
                                    .toLowerCase()
                                    .capitalizeFirst()}
                            </dd>
                            {/*https://stackoverflow.com/questions/50784444/add-description-attribute-to-enum-and-read-this-description-in-typescript*/}
                        </dl>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} lg={6} className="mb-3 mb-lg-0">
                        <dl>
                            <dt>{spanish ? "Escuela" : "School"}</dt>
                            <dd>{school ? school.name : "N/A"}</dd>
                        </dl>
                    </Col>
                    <Col xs={12} lg={6}>
                        <dl>
                            <dt>Sponsor</dt>
                            <dd>Todo</dd>
                        </dl>
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
