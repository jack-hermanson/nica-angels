import { FunctionComponent, useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { useMinClearance } from "../../utils/useMinClearance";
import {
    Clearance,
    SponsorRecord,
    SponsorshipRecord,
    StudentRecord,
} from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";
import { SponsorshipClient } from "../../clients/SponsorshipClient";
import { StudentClient } from "../../clients/StudentClient";
import { SponsorClient } from "../../clients/SponsorClient";
import { SponsorshipCardBody } from "./SponsorshipCardBody";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { FaEdit } from "react-icons/all";
import { BUTTON_ICON_CLASSES } from "../../utils/constants";

interface Props extends RouteComponentProps<{ id: string }> {}

export const SponsorshipDetails: FunctionComponent<Props> = ({
    match,
}: Props) => {
    useMinClearance(Clearance.ADMIN);

    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const [sponsorship, setSponsorship] = useState<
        SponsorshipRecord | undefined
    >(undefined);
    const [student, setStudent] = useState<StudentRecord | undefined>(
        undefined
    );
    const [sponsor, setSponsor] = useState<SponsorRecord | undefined>(
        undefined
    );

    useEffect(() => {
        if (token) {
            SponsorshipClient.getOne(
                parseInt(match.params.id),
                token.data
            ).then(data => {
                setSponsorship(data);
            });
        }
    }, [setSponsorship, token, match.params.id]);

    useEffect(() => {
        if (token && sponsorship) {
            StudentClient.getOne(sponsorship.studentId, token.data).then(
                data => {
                    setStudent(data);
                }
            );
        }
    }, [token, sponsorship, setStudent]);

    useEffect(() => {
        if (token && sponsorship) {
            SponsorClient.getOne(sponsorship.sponsorId, token.data).then(
                data => {
                    setSponsor(data);
                }
            );
        }
    }, [token, sponsorship, setSponsor]);

    return (
        <div>
            <SettingsTabs />
            {renderPageHeader()}
            <Row>
                {renderDetails()}
                {renderPayments()}
            </Row>
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader
                        title={
                            spanish
                                ? "Patronicio Detalles"
                                : "Sponsorship Details"
                        }
                    >
                        {sponsorship && (
                            <Link
                                to={`/settings/sponsorships/edit/${sponsorship.id}`}
                                className="btn btn-sm btn-secondary"
                            >
                                <FaEdit className={BUTTON_ICON_CLASSES} />
                                {spanish ? "Editar" : "Edit"}
                            </Link>
                        )}
                    </PageHeader>
                </Col>
            </Row>
        );
    }

    function renderDetails() {
        return (
            <Col xs={12} lg={8} className="mb-3 mb-lg-0">
                <Card>
                    <CardHeader>
                        <h5 className="mb-0">
                            {spanish ? "Detalles" : "Details"}
                        </h5>
                    </CardHeader>
                    {sponsor && student && sponsorship ? (
                        <SponsorshipCardBody
                            sponsor={sponsor}
                            student={student}
                            sponsorship={sponsorship}
                        />
                    ) : (
                        <CardBody>
                            <LoadingSpinner />
                        </CardBody>
                    )}
                </Card>
            </Col>
        );
    }

    function renderPayments() {
        return (
            <Col xs={12} lg={4}>
                <Card>
                    <CardHeader>
                        <h5 className="mb-0">Payment History</h5>
                    </CardHeader>
                    <CardBody>
                        <p>Under construction</p>
                    </CardBody>
                </Card>
            </Col>
        );
    }
};
