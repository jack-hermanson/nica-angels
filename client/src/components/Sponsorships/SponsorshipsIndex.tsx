import { FunctionComponent } from "react";
import { Col, Row } from "reactstrap";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { PageHeader } from "jack-hermanson-component-lib";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";
import { BUTTON_ICON_CLASSES, NEW_BUTTON_COLOR } from "../../utils/constants";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export const SponsorshipsIndex: FunctionComponent = () => {
    useMinClearance(Clearance.ADMIN);

    const spanish = useStoreState(state => state.spanish);

    return (
        <div>
            <SettingsTabs />
            {renderPageHeader()}
            <Row>
                <Col>
                    <p>this is sponsorships</p>
                </Col>
            </Row>
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
};
