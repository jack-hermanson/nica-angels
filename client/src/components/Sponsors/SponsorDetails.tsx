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

    const token = useStoreState(state => state.token);
    const spanish = useStoreState(state => state.spanish);

    useEffect(() => {
        if (token) {
            SponsorClient.getOne(parseInt(match.params.id), token.data).then(
                sponsorData => {
                    setSponsor(sponsorData);
                    if (sponsorData.accountId) {
                        AccountClient.getAccount(
                            sponsorData.accountId,
                            token.data
                        ).then(accountData => {
                            setAccount(accountData);
                        });
                    }
                    SponsorshipClient.getManyFromSponsorId(
                        sponsorData.id,
                        token.data
                    ).then(sponsorshipData => {
                        setSponsorships(sponsorshipData);
                        if (sponsorshipData) {
                            for (let sponsorship of sponsorshipData) {
                                StudentClient.getOne(
                                    sponsorship.studentId,
                                    token.data
                                ).then(studentData => {
                                    setStudents(s => [...s, studentData]);
                                });
                            }
                        }
                    });
                }
            );
        }
    }, [
        token,
        match.params.id,
        setSponsor,
        setAccount,
        setSponsorships,
        setStudents,
    ]);

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
            <Col xs={12} lg={4}>
                <Card>
                    <ActionCardHeader title={spanish ? "Pagos" : "Payments"} />
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
                                                    {student.lastName} (
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
