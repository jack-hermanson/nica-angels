import { FunctionComponent, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { AccountRecord, Clearance, SponsorRecord } from "@nica-angels/shared";
import { Col, Row } from "reactstrap";
import { useStoreState } from "../../store/_store";
import { SponsorClient } from "../../clients/SponsorClient";
import { useMinClearance } from "../../utils/useMinClearance";
import { Link } from "react-router-dom";
import { BUTTON_ICON_CLASSES } from "../../utils/constants";
import { FaPencilAlt } from "react-icons/fa";
import { AccountClient } from "../../clients/AccountClient";
import { SponsorDetailCard } from "./SponsorDetailCard";

interface Props extends RouteComponentProps<{ id: string }> {}

export const SponsorDetails: FunctionComponent<Props> = ({ match }: Props) => {
    useMinClearance(Clearance.ADMIN);

    const [sponsor, setSponsor] = useState<SponsorRecord | undefined>(
        undefined
    );
    const [account, setAccount] = useState<AccountRecord | undefined>(
        undefined
    );

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
                }
            );
        }
    }, [token, match.params.id, setSponsor, setAccount]);

    return (
        <div>
            {renderPageHeader()}
            {renderSponsorDetails()}
            {renderSponsorships()}
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
            <Row>
                <Col>
                    {sponsor ? (
                        <SponsorDetailCard
                            sponsor={sponsor}
                            account={account}
                        />
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        );
    }

    function renderSponsorships() {
        return (
            <Row className="mt-3">
                <Col>To do: show sponsorships here</Col>
            </Row>
        );
    }
};
