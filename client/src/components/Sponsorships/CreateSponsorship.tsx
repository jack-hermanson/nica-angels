import { FunctionComponent } from "react";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance, SponsorshipRequest } from "@nica-angels/shared";
import { useStoreActions, useStoreState } from "../../store/_store";
import { CreateEditSponsorshipForm } from "./CreateEditSponsorshipForm";
import { SponsorshipClient } from "../../clients/SponsorshipClient";
import { errorAlert, scrollToTop, successAlert } from "jack-hermanson-ts-utils";
import { useHistory } from "react-router-dom";

export const CreateSponsorship: FunctionComponent = () => {
    useMinClearance(Clearance.ADMIN);

    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);
    const addAlert = useStoreActions(actions => actions.addAlert);

    const history = useHistory();

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
                addAlert(successAlert("sponsorship", "saved"));
                history.push(`/sponsorships/${sponsorship.id}`);
            } catch (error: any) {
                addAlert(errorAlert(error.message));
                scrollToTop();
            }
        }
    }
};
