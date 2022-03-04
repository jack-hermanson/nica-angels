import { Fragment, FunctionComponent, useEffect, useState } from "react";
import {
    getIdPadded,
    SponsorRecord,
    SponsorshipRecord,
    StudentRecord,
} from "@nica-angels/shared";
import { Card, CardBody, CardFooter, CardHeader } from "reactstrap";
import { KeyValCardBody, LoadingSpinner } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { StudentClient } from "../../clients/StudentClient";
import { SponsorClient } from "../../clients/SponsorClient";
import { Link } from "react-router-dom";
import { DATE_FORMAT, ID_PADDING } from "../../utils/constants";
import moment from "moment";

interface Props {
    sponsorship: SponsorshipRecord;
    className?: string;
}

export const Sponsorship: FunctionComponent<Props> = ({
    sponsorship,
    className,
}: Props) => {
    const token = useStoreState(state => state.token);
    const spanish = useStoreState(state => state.spanish);

    const [student, setStudent] = useState<StudentRecord | undefined>(
        undefined
    );
    const [sponsor, setSponsor] = useState<SponsorRecord | undefined>(
        undefined
    );

    useEffect(() => {
        if (token) {
            StudentClient.getOne(sponsorship.studentId, token.data).then(
                data => {
                    setStudent(data);
                }
            );
        }
    }, [token, sponsorship.studentId, setStudent]);

    useEffect(() => {
        if (token) {
            SponsorClient.getOne(sponsorship.sponsorId, token.data).then(
                data => {
                    setSponsor(data);
                }
            );
        }
    }, [token, sponsorship.sponsorId, setSponsor]);

    return (
        <Card className={className || ""}>
            {sponsor && student ? (
                <Fragment>
                    <CardHeader className="d-flex">
                        <h5 className="my-auto me-auto">
                            <Link
                                className="header-link"
                                to={`/settings/sponsorships/${sponsorship.id}`}
                            >
                                {student.firstName} {student.middleName}{" "}
                                {student.lastName}
                            </Link>
                        </h5>
                    </CardHeader>
                    {renderDetails()}
                    <CardFooter>
                        <Link
                            to={`/settings/sponsorships/edit/${sponsorship.id}`}
                            className="text-muted"
                        >
                            {spanish ? "Editar" : "Edit"}
                        </Link>
                    </CardFooter>
                </Fragment>
            ) : (
                <CardBody>
                    <LoadingSpinner />
                </CardBody>
            )}
        </Card>
    );

    function renderDetails() {
        if (sponsor && student) {
            const keyValPairs = [
                {
                    key: spanish ? "Estudiante" : "Student",
                    val: (
                        <Link className="ps-0" to={`/students/${student.id}`}>
                            {student.firstName} {student.middleName}{" "}
                            {student.lastName} (#
                            {getIdPadded(student, ID_PADDING)})
                        </Link>
                    ),
                },
                {
                    key: spanish ? "Padrino" : "Sponsor",
                    val: (
                        <Link className="ps-0" to={`/sponsors/${sponsor.id}`}>
                            {sponsor.firstName} {sponsor.lastName}
                        </Link>
                    ),
                },
                {
                    key: spanish ? "Pago" : "Payment",
                    val: `$${sponsorship.payment}`,
                },
                {
                    key: spanish ? "Frecuencia" : "Frequency",
                    val: `${sponsorship.frequency}/${spanish ? "año" : "year"}`,
                },
                {
                    key: spanish ? "Fecha de Comienza" : "Start Date",
                    val: moment(sponsorship.startDate).format(DATE_FORMAT),
                },
            ];
            if (sponsorship.endDate) {
                keyValPairs.push({
                    key: spanish ? "Fecha de Cierre" : "End Date",
                    val: moment(sponsorship.endDate).format(DATE_FORMAT),
                });
            }
            return <KeyValCardBody keyValPairs={keyValPairs} />;
        }
    }
};
