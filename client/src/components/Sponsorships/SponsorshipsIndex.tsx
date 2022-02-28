import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance, SponsorshipRecord } from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";
import { BUTTON_ICON_CLASSES, NEW_BUTTON_COLOR } from "../../utils/constants";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Sponsorship } from "./Sponsorship";
import { SponsorshipClient } from "../../clients/SponsorshipClient";

export const SponsorshipsIndex: FunctionComponent = () => {
    useMinClearance(Clearance.ADMIN);

    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const [sponsorships, setSponsorships] = useState<
        SponsorshipRecord[] | undefined
    >(undefined);

    useEffect(() => {
        if (token) {
            SponsorshipClient.getAll(token.data).then(data => {
                setSponsorships(data);
            });
        }
    }, [token, setSponsorships]);

    return (
        <div>
            <SettingsTabs />
            {renderPageHeader()}
            {renderSponsorships()}
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader
                        title={spanish ? "Patrocinios" : "Sponsorships"}
                    >
                        <Link
                            to="/settings/sponsorships/new"
                            className={`icon-button btn btn-sm btn-${NEW_BUTTON_COLOR}`}
                        >
                            <FaPlus className={BUTTON_ICON_CLASSES} />
                            {spanish ? "Nuevo Patrocinio" : "New Sponsorship"}
                        </Link>
                    </PageHeader>
                </Col>
            </Row>
        );
    }

    function renderSponsorships() {
        return (
            <Row>
                <Col>
                    {!sponsorships ? (
                        <LoadingSpinner />
                    ) : (
                        <Fragment>
                            {sponsorships.map(sponsorship => (
                                <Sponsorship
                                    sponsorship={sponsorship}
                                    key={sponsorship.id}
                                />
                            ))}
                        </Fragment>
                    )}
                </Col>
            </Row>
        );
    }
};
