import { FunctionComponent } from "react";
import { Col, Row } from "reactstrap";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { PageHeader } from "jack-hermanson-component-lib";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";

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
                    />
                </Col>
            </Row>
        );
    }
};
