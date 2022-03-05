import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import {
    AccountRecord,
    Clearance,
    SponsorRecord,
    SponsorshipRecord,
} from "@nica-angels/shared";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    Row,
} from "reactstrap";
import { useStoreState } from "../../store/_store";
import { SponsorClient } from "../../clients/SponsorClient";
import { useMinClearance } from "../../utils/useMinClearance";
import { Link } from "react-router-dom";
import { BUTTON_ICON_CLASSES } from "../../utils/constants";
import { FaPencilAlt } from "react-icons/fa";
import { AccountClient } from "../../clients/AccountClient";
import { SponsorDetailCard } from "./SponsorDetailCard";
import { SponsorshipClient } from "../../clients/SponsorshipClient";

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

    const token = useStoreState(state => state.token);

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
                    });
                }
            );
        }
    }, [token, match.params.id, setSponsor, setAccount, setSponsorships]);

    return (
        <div>
            {renderPageHeader()}
            <Row>
                {renderSponsorDetails()}
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
                            Edit
                        </Link>
                    </PageHeader>
                </Col>
            </Row>
        );
    }

    function renderSponsorDetails() {
        return (
            <Col xs={12} lg={8} className="mb-3 mb-lg-0">
                {sponsor ? (
                    <SponsorDetailCard sponsor={sponsor} account={account} />
                ) : (
                    <LoadingSpinner />
                )}
            </Col>
        );
    }

    function renderSponsorships() {
        return (
            <Col xs={12} lg={4}>
                <Card>
                    <CardHeader>
                        <h5 className="mb-0">Sponsorships</h5>
                    </CardHeader>
                    <CardBody className="p-0">
                        {sponsorships ? (
                            <ListGroup flush>
                                {sponsorships.map(sponsorship => (
                                    <Fragment key={sponsorship.id}>
                                        <ListGroupItem key={sponsorship.id}>
                                            Test
                                        </ListGroupItem>
                                        <ListGroupItem key={sponsorship.id}>
                                            Test
                                        </ListGroupItem>
                                    </Fragment>
                                ))}
                            </ListGroup>
                        ) : (
                            <LoadingSpinner />
                        )}
                    </CardBody>
                </Card>
            </Col>
        );
    }
};
