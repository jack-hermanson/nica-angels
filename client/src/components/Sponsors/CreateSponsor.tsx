import { FunctionComponent } from "react";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance, SponsorRequest } from "@nica-angels/shared";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { useStoreActions, useStoreState } from "../../store/_store";
import { CreateEditSponsorForm } from "./CreateEditSponsorForm";
import { SponsorClient } from "../../clients/SponsorClient";
import { scrollToTop } from "jack-hermanson-ts-utils";
import { useHistory } from "react-router-dom";

export const CreateSponsor: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);
    const addAlert = useStoreActions(actions => actions.addAlert);

    const history = useHistory();

    useMinClearance(Clearance.ADMIN);

    return (
        <div>
            {renderPageHeader()}
            {renderForm()}
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader
                        title={spanish ? "Nuevo Padrino" : "New Sponsor"}
                    />
                </Col>
            </Row>
        );
    }

    function renderForm() {
        return (
            <div>
                <Row>
                    <Col>
                        <CreateEditSponsorForm
                            onSubmit={async (
                                sponsorRequest: SponsorRequest
                            ) => {
                                if (token) {
                                    try {
                                        const sponsor =
                                            await SponsorClient.create(
                                                sponsorRequest,
                                                token.data
                                            );
                                        addAlert({
                                            color: "success",
                                            text: `Sponsor ${sponsor.firstName} ${sponsor.lastName} saved successfully.`,
                                        });
                                        history.push(`/sponsors/${sponsor.id}`);
                                    } catch (error: any) {
                                        addAlert({
                                            color: "danger",
                                            text: error.message,
                                        });
                                        scrollToTop();
                                    }
                                }
                            }}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
};
