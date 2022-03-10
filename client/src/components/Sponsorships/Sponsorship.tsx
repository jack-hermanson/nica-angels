import { Fragment, FunctionComponent, useEffect, useState } from "react";
import {
    SponsorRecord,
    SponsorshipRecord,
    StudentRecord,
} from "@nica-angels/shared";
import { Card, CardBody, CardFooter, CardHeader } from "reactstrap";
import { LoadingSpinner } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { StudentClient } from "../../clients/StudentClient";
import { SponsorClient } from "../../clients/SponsorClient";
import { Link } from "react-router-dom";
import { SponsorshipCardBody } from "./SponsorshipCardBody";

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
                                to={`/sponsorships/${sponsorship.id}`}
                            >
                                {student.firstName} {student.middleName}{" "}
                                {student.lastName}
                            </Link>
                        </h5>
                    </CardHeader>
                    {renderDetails()}
                    <CardFooter>
                        <Link
                            to={`/sponsorships/edit/${sponsorship.id}`}
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
            return (
                <SponsorshipCardBody
                    sponsor={sponsor}
                    student={student}
                    sponsorship={sponsorship}
                />
            );
        }
    }
};
