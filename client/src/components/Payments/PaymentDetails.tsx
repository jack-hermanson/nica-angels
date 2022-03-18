import { RouteComponentProps } from "react-router-dom";
import { FunctionComponent, useEffect, useState } from "react";
import { SponsorTabs } from "../Sponsors/SponsorTabs";
import {
    ActionCardHeader,
    LoadingSpinner,
    PageHeader,
} from "jack-hermanson-component-lib";
import {
    Card,
    CardBody,
    Col,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    Row,
} from "reactstrap";
import { useMinClearance } from "../../utils/useMinClearance";
import {
    Clearance,
    ExpandedSponsorshipRecord,
    PaymentRecord,
} from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";
import { PaymentClient } from "../../clients/PaymentClient";
import { SponsorshipClient } from "../../clients/SponsorshipClient";
import { PaymentCardBody } from "./PaymentCardBody";
import moment from "moment";
import { Link } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import { BUTTON_ICON_CLASSES } from "../../utils/constants";

interface Props extends RouteComponentProps<{ id: string }> {}

export const PaymentDetails: FunctionComponent<Props> = ({ match }: Props) => {
    useMinClearance(Clearance.ADMIN);

    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const [payment, setPayment] = useState<PaymentRecord | undefined>(
        undefined
    );
    const [sponsorships, setSponsorships] = useState<
        ExpandedSponsorshipRecord[] | undefined
    >(undefined);

    useEffect(() => {
        if (token) {
            PaymentClient.getOne(parseInt(match.params.id), token.data).then(
                data => {
                    setPayment(data);
                }
            );
        }
    }, [token, setPayment, match]);

    useEffect(() => {
        if (token) {
            SponsorshipClient.getExpandedSponsorships(token.data).then(data => {
                setSponsorships(data);
            });
        }
    }, [token, setSponsorships]);

    return (
        <div>
            <SponsorTabs />
            {renderPageHeader()}
            <Row>
                {renderDetailCard()}
                {renderLogs()}
            </Row>
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader
                        title={spanish ? "Pago Detalles" : "Payment Details"}
                    >
                        <Link
                            to={`/payments/edit/${match.params.id}`}
                            className="icon-button btn btn-sm btn-secondary"
                        >
                            <FaPencilAlt className={BUTTON_ICON_CLASSES} />
                            {spanish ? "Editar" : "Edit"}
                        </Link>
                    </PageHeader>
                </Col>
            </Row>
        );
    }

    function renderDetailCard() {
        return (
            <Col xs={12} lg={8} className="mb-3 mb-lg-0">
                {payment ? (
                    <Card>
                        <PaymentCardBody
                            payment={payment}
                            sponsorships={sponsorships}
                        />
                    </Card>
                ) : (
                    <LoadingSpinner />
                )}
            </Col>
        );
    }

    function renderLogs() {
        return (
            <Col xs={12} lg={4}>
                {payment ? (
                    <Card>
                        <ActionCardHeader title="Logs" />
                        <CardBody className="p-0">
                            <ListGroup flush>
                                {payment.paymentLogs?.map(log => (
                                    <ListGroupItem key={log.id}>
                                        <ListGroupItemHeading className="mb-1">
                                            {moment(log.created).format("LLL")}
                                        </ListGroupItemHeading>
                                        <ListGroupItemText className="mb-0">
                                            {log.notes}
                                        </ListGroupItemText>
                                        <ListGroupItemText className="mb-0 text-muted">
                                            {log.ipAddress}
                                        </ListGroupItemText>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        </CardBody>
                    </Card>
                ) : (
                    <LoadingSpinner />
                )}
            </Col>
        );
    }
};
