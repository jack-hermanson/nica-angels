import { FunctionComponent } from "react";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance, SponsorRequest } from "@nica-angels/shared";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { CreateEditSponsorForm } from "./CreateEditSponsorForm";

export const CreateSponsor: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);
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
                                console.log(sponsorRequest);
                            }}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
};
