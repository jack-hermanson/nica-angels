import { FunctionComponent, useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import {
    ActionCardHeader,
    LoadingSpinner,
    PageHeader,
} from "jack-hermanson-component-lib";
import { useMinClearance } from "../../utils/useMinClearance";
import {
    Clearance,
    PaymentRecord,
    SponsorRecord,
    SponsorshipRecord,
    StudentRecord,
} from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";
import { SponsorshipClient } from "../../clients/SponsorshipClient";
import { StudentClient } from "../../clients/StudentClient";
import { SponsorClient } from "../../clients/SponsorClient";
import { SponsorshipCardBody } from "./SponsorshipCardBody";
import { BUTTON_ICON_CLASSES, NEW_BUTTON_COLOR } from "../../utils/constants";
import { SponsorTabs } from "../Sponsors/SponsorTabs";
import { FaPencilAlt, FaPlus } from "react-icons/fa";
import { PaymentClient } from "../../clients/PaymentClient";
import { PaymentsListGroup } from "../Payments/PaymentsListGroup";

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
    const [payments, setPayments] = useState<PaymentRecord[] | undefined>(
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

    useEffect(() => {
        if (token && sponsorship) {
            PaymentClient.getManyFromSponsorshipId(
                sponsorship.id,
                token.data
            ).then(data => {
                setPayments(data);
            });
        }
    }, [token, sponsorship, setPayments]);

    return (
        <div>
            <SponsorTabs />
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
                                ? "Patrocinio Detalles"
                                : "Sponsorship Details"
                        }
                    >
                        {sponsorship && (
                            <Link
                                to={`/sponsorships/edit/${sponsorship.id}`}
                                className="icon-button btn btn-sm btn-secondary"
                            >
                                <FaPencilAlt className={BUTTON_ICON_CLASSES} />
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
                    <ActionCardHeader title="Payment History">
                        {sponsorship && (
                            <Link
                                to={`/payments/new/${sponsorship.id}`}
                                className={`icon-button btn btn-sm btn-${NEW_BUTTON_COLOR}`}
                            >
                                <FaPlus className={BUTTON_ICON_CLASSES} />
                                Make Payment
                            </Link>
                        )}
                    </ActionCardHeader>
                    <PaymentsListGroup payments={payments} />
                </Card>
            </Col>
        );
    }
};
