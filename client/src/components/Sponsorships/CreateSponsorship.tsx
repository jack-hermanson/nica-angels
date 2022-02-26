import { FunctionComponent } from "react";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance, SponsorshipRequest } from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";
import { CreateEditSponsorshipForm } from "./CreateEditSponsorshipForm";
import { SponsorshipClient } from "../../clients/SponsorshipClient";

export const CreateSponsorship: FunctionComponent = () => {
    useMinClearance(Clearance.ADMIN);

    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    return (
        <div>
            <SettingsTabs />
            {renderPageHeader()}
            {renderForm()}
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader
                        title={spanish ? "Nuevo Patrocinio" : "New Sponsorship"}
                    />
                </Col>
            </Row>
        );
    }

    function renderForm() {
        return (
            <Row>
                <Col>
                    <CreateEditSponsorshipForm onSubmit={onSubmit} />
                </Col>
            </Row>
        );
    }

    async function onSubmit(sponsorshipRequest: SponsorshipRequest) {
        if (token) {
            try {
                const sponsorship = await SponsorshipClient.create(
                    sponsorshipRequest,
                    token.data
                );
            } catch (error) {}
        }
    }
};
