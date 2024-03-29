import { Fragment, FunctionComponent, useEffect, useState } from "react";
import {
    Clearance,
    getAge,
    getIdPadded,
    SchoolRecord,
    sexToString,
    SponsorRecord,
    StudentRecord,
} from "@nica-angels/shared";
import { Card, CardBody, CardFooter, Col, Row } from "reactstrap";
import { ActionCardHeader, KeyValTable } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { Link } from "react-router-dom";
import moment from "moment";
import { StudentImage } from "./StudentImage";
import { ID_PADDING } from "../../utils/constants";
import { SponsorshipClient } from "../../clients/SponsorshipClient";
import { SponsorClient } from "../../clients/SponsorClient";

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
    const token = useStoreState(state => state.token);

    const [sponsor, setSponsor] = useState<SponsorRecord | undefined>(
        undefined
    );

    useEffect(() => {
        if (token) {
            SponsorshipClient.getOneFromStudentId(student.id, token.data).then(
                sponsorshipData => {
                    if (sponsorshipData) {
                        SponsorClient.getOne(
                            sponsorshipData.sponsorId,
                            token.data
                        ).then(sponsorData => {
                            setSponsor(sponsorData);
                        });
                    }
                }
            );
        }
    }, [student.id, token, setSponsor]);

    return (
        <Card className="mb-3 no-mb-last">
            <ActionCardHeader
                title={`${spanish ? "Estudiante" : "Student"} #${getIdPadded(
                    student,
                    ID_PADDING
                )}`}
                linkTo={`/students/${student.id}`}
            />
            <CardBody>
                <Row>
                    <Col xs={4} lg={2} className="mb-3 mb-lg-0">
                        <StudentImage imageId={student.imageId} />
                    </Col>
                    <Col xs={12} lg={10}>
                        <h4>
                            {student.firstName} {student.middleName || ""}{" "}
                            {student.lastName || ""}
                        </h4>
                        {renderData()}
                    </Col>
                </Row>
            </CardBody>
            {renderFooter()}
        </Card>
    );

    function renderData() {
        const keyValPairs = [
            {
                key: spanish ? "Fecha de Nacimiento" : "Date of Birth",
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
                val: sexToString(student.sex, spanish),
            },
            {
                key: spanish ? "Escuela" : "School",
                val: school ? (
                    <Link to={`/schools/edit/${school.id}`} className="ps-0">
                        {school.name}
                    </Link>
                ) : (
                    "N/A"
                ),
            },
        ];

        if (sponsor) {
            keyValPairs.push({
                key: spanish ? "Padrino" : "Sponsor",
                val: (
                    <Link className="ps-0" to={`/sponsors/${sponsor.id}`}>
                        {sponsor.firstName} {sponsor.lastName}
                    </Link>
                ),
            });
        }

        return <KeyValTable className="mb-0" keyValPairs={keyValPairs} />;
    }

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
                        to={`/enrollments/new/${student.id}`}
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
        const yearsOld = getAge(student);
        return (
            <Fragment>
                {dateOfBirth?.toLocaleDateString() || "N/A"}{" "}
                {yearsOld && `(${spanish ? "edad" : "age"} ${yearsOld})`}
            </Fragment>
        );
    }
};
