import { FunctionComponent, useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { useMinClearance } from "../../utils/useMinClearance";
import {
    Clearance,
    SponsorshipRecord,
    SponsorshipRequest,
} from "@nica-angels/shared";
import { Col, Row } from "reactstrap";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { useStoreActions, useStoreState } from "../../store/_store";
import { CreateEditSponsorshipForm } from "./CreateEditSponsorshipForm";
import { SponsorshipClient } from "../../clients/SponsorshipClient";
import { errorAlert, scrollToTop, successAlert } from "jack-hermanson-ts-utils";
import { SettingsTabs } from "../Settings/SettingsTabs";

interface Props extends RouteComponentProps<{ id: string }> {}

export const EditSponsorship: FunctionComponent<Props> = ({ match }: Props) => {
    useMinClearance(Clearance.ADMIN);

    const history = useHistory();

    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);
    const addAlert = useStoreActions(actions => actions.addAlert);

    const [sponsorship, setSponsorship] = useState<
        SponsorshipRecord | undefined
    >(undefined);

    useEffect(() => {
        if (token) {
            SponsorshipClient.getOne(
                parseInt(match.params.id),
                token.data
            ).then(data => {
                setSponsorship(data);
            });
        }
    }, [match.params.id, token, setSponsorship]);

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
                        title={
                            spanish ? "Editar Patronicio" : "Edit Sponsorship"
                        }
                    />
                </Col>
            </Row>
        );
    }

    function renderForm() {
        return (
            <Row>
                <Col>
                    {sponsorship ? (
                        <CreateEditSponsorshipForm
                            onSubmit={onSubmit}
                            existingSponsorship={sponsorship}
                        />
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        );
    }

    async function onSubmit(sponsorshipRequest: SponsorshipRequest) {
        if (token) {
            try {
                const editedSponsorship = await SponsorshipClient.edit(
                    parseInt(match.params.id),
                    sponsorshipRequest,
                    token.data
                );
                addAlert(successAlert("sponsorship", "edited"));
                history.push(`/sponsorships/${editedSponsorship.id}`);
            } catch (error: any) {
                addAlert(errorAlert(error.message));
                scrollToTop();
            }
        }
    }
};
