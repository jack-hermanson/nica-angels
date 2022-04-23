import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import {
    ActionCardHeader,
    LoadingSpinner,
    PageHeader,
} from "jack-hermanson-component-lib";
import {
    AccountRecord,
    Clearance,
    PaymentRecord,
    SponsorRecord,
    SponsorshipRecord,
    StudentRecord,
} from "@nica-angels/shared";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    ListGroup,
    ListGroupItem,
    Row,
} from "reactstrap";
import { useStoreState } from "../../store/_store";
import { SponsorClient } from "../../clients/SponsorClient";
import { useMinClearance } from "../../utils/useMinClearance";
import { Link } from "react-router-dom";
import { BUTTON_ICON_CLASSES, DATE_FORMAT } from "../../utils/constants";
import { FaPencilAlt } from "react-icons/fa";
import { AccountClient } from "../../clients/AccountClient";
import { SponsorDetailCard } from "./SponsorDetailCard";
import { SponsorshipClient } from "../../clients/SponsorshipClient";
import { StudentClient } from "../../clients/StudentClient";
import moment from "moment";
import { SponsorTabs } from "./SponsorTabs";
import { PaymentClient } from "../../clients/PaymentClient";
import { PaymentsListGroup } from "../Payments/PaymentsListGroup";

interface Props extends RouteComponentProps<{ id: string }> {}

export const SponsorDetails: FunctionComponent<Props> = ({ match }: Props) => {
    useMinClearance(Clearance.ADMIN);

    const [sponsor, setSponsor] = useState<SponsorRecord | undefined>(
        undefined
    );
    const [account, setAccount] = useState<AccountRecord | undefined>(
        undefined
    );
    const [sponsorships, setSponsorships] = useState<
        SponsorshipRecord[] | undefined
    >(undefined);
    const [students, setStudents] = useState<StudentRecord[]>([]);
    const [payments, setPayments] = useState<PaymentRecord[] | undefined>(
        undefined
    );

    const token = useStoreState(state => state.token);
    const spanish = useStoreState(state => state.spanish);

    useEffect(() => {
        if (token) {
            SponsorClient.getOne(parseInt(match.params.id), token.data).then(
                data => {
                    setSponsor(data);
                }
            );
        }
    }, [setSponsor, token, match]);

    useEffect(() => {
        if (token && sponsor?.accountId) {
            AccountClient.getAccount(sponsor.accountId, token.data).then(
                data => {
                    setAccount(data);
                }
            );
        }
    }, [sponsor, setAccount, token]);

    useEffect(() => {
        if (token) {
            SponsorshipClient.getManyFromSponsorId(
                parseInt(match.params.id),
                token.data
            ).then(data => {
                setSponsorships(data);
            });
        }
    }, [setSponsorships, match, token]);

    useEffect(() => {
        if (token && sponsorships) {
            for (let sponsorship of sponsorships) {
                StudentClient.getOne(sponsorship.studentId, token.data).then(
                    data => {
                        setStudents(s => [...s, data]);
                    }
                );
            }
        }
    }, [setStudents, sponsorships, token]);

    useEffect(() => {
        if (token) {
            PaymentClient.getManyFromSponsorId(
                parseInt(match.params.id),
                token.data
            ).then(data => {
                setPayments(data);
            });
        }
    }, [token, setPayments, match]);

    return (
        <div>
            <SponsorTabs />
            {renderPageHeader()}
            <Row>
                {renderSponsorDetails()}
                {renderPayments()}
                {renderSponsorships()}
            </Row>
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader
                        title={
                            sponsor
                                ? `${sponsor.firstName} ${sponsor.lastName}`
                                : "Sponsor Details"
                        }
                    >
                        <Link
                            className={`icon-button btn btn-sm btn-secondary`}
                            to={`/sponsors/edit/${match.params.id}`}
                        >
                            <FaPencilAlt className={BUTTON_ICON_CLASSES} />
                            {spanish ? "Editar" : "Edit"}
                        </Link>
                    </PageHeader>
                </Col>
            </Row>
        );
    }

    function renderSponsorDetails() {
        return (
            <Col xs={12} lg={4} className="mb-3 mb-lg-0">
                {sponsor ? (
                    <SponsorDetailCard sponsor={sponsor} account={account} />
                ) : (
                    <LoadingSpinner />
                )}
            </Col>
        );
    }

    function renderPayments() {
        return (
            <Col xs={12} lg={4} className="mb-3 mb-lg-0">
                <Card>
                    <ActionCardHeader title={spanish ? "Pagos" : "Payments"} />
                    <PaymentsListGroup payments={payments} />
                </Card>
            </Col>
        );
    }

    function renderSponsorships() {
        return (
            <Col xs={12} lg={4}>
                <Card>
                    <CardHeader>
                        <h5 className="mb-0">
                            {spanish ? "Patrocinios" : "Sponsorships"}
                        </h5>
                    </CardHeader>
                    <CardBody className={sponsorships?.length ? "p-0" : ""}>
                        {sponsorships?.length ? (
                            <ListGroup flush>
                                {sponsorships.map(sponsorship => {
                                    const student = students.find(
                                        s => s.id === sponsorship.studentId
                                    );
                                    return (
                                        <ListGroupItem key={sponsorship.id}>
                                            {student ? (
                                                <Link
                                                    className="text-white"
                                                    to={`/sponsorships/${sponsorship.id}`}
                                                >
                                                    {student.firstName}{" "}
                                                    {student.middleName}{" "}
                                                    {student.lastName} ($
                                                    {sponsorship.payment.toFixed(
                                                        2
                                                    )}
                                                    *{sponsorship.frequency}/
                                                    {spanish ? "año" : "year"})
                                                    (
                                                    {spanish
                                                        ? "Desde "
                                                        : "Since "}
                                                    {moment(
                                                        sponsorship.startDate
                                                    ).format(DATE_FORMAT)}
                                                    )
                                                </Link>
                                            ) : (
                                                <Fragment>...</Fragment>
                                            )}
                                        </ListGroupItem>
                                    );
                                })}
                            </ListGroup>
                        ) : (
                            <Fragment>
                                {!sponsorships ? (
                                    <LoadingSpinner />
                                ) : (
                                    <p className="mb-0">
                                        {spanish
                                            ? "Este padrino no patrocina a ningún estudiante."
                                            : "This sponsor does not sponsor any students."}
                                    </p>
                                )}
                            </Fragment>
                        )}
                    </CardBody>
                </Card>
            </Col>
        );
    }
};
