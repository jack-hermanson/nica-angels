import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { useMinClearance } from "../../utils/useMinClearance";
import { AccountRecord, Clearance, SponsorRecord } from "@nica-angels/shared";
import { Link } from "react-router-dom";
import { BUTTON_ICON_CLASSES, NEW_BUTTON_COLOR } from "../../utils/constants";
import { FaPlus } from "react-icons/fa";
import { Col, Row } from "reactstrap";
import { AccountClient } from "../../clients/AccountClient";
import { SponsorClient } from "../../clients/SponsorClient";
import { SponsorDetailCard } from "./SponsorDetailCard";

export const SponsorsIndex: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const [accounts, setAccounts] = useState<AccountRecord[] | undefined>(
        undefined
    );
    const [sponsors, setSponsors] = useState<SponsorRecord[] | undefined>(
        undefined
    );

    useEffect(() => {
        if (token) {
            AccountClient.getAccounts(token.data).then(data => {
                setAccounts(data);
            });
            SponsorClient.getAll(token.data).then(data => {
                setSponsors(data);
            });
        }
    }, [setAccounts, token, setSponsors]);

    useMinClearance(Clearance.ADMIN);

    return (
        <div>
            {renderPageHeader()}
            {renderList()}
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader title={spanish ? "Padrinos" : "Sponsors"}>
                        <Link
                            to="/sponsors/new"
                            className={`icon-button btn btn-sm btn-${NEW_BUTTON_COLOR}`}
                        >
                            <FaPlus className={BUTTON_ICON_CLASSES} />
                            {spanish ? "Nuevo Padrino" : "New Sponsor"}
                        </Link>
                    </PageHeader>
                </Col>
            </Row>
        );
    }

    function renderList() {
        return (
            <Row>
                <Col xs={12} lg={9}>
                    {sponsors && accounts ? (
                        <Fragment>
                            {sponsors.map(sponsor => (
                                <SponsorDetailCard
                                    key={sponsor.id}
                                    sponsor={sponsor}
                                    account={accounts.find(
                                        a => a.id === sponsor.accountId
                                    )}
                                    showAccountLink={true}
                                />
                            ))}
                        </Fragment>
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        );
    }
};
