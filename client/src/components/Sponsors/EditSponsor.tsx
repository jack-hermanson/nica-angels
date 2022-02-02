import { FunctionComponent, useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { SponsorRecord, SponsorRequest } from "@nica-angels/shared";
import { useStoreActions, useStoreState } from "../../store/_store";
import { SponsorClient } from "../../clients/SponsorClient";
import { CreateEditSponsorForm } from "./CreateEditSponsorForm";
import { scrollToTop } from "jack-hermanson-ts-utils";

interface Props extends RouteComponentProps<{ id: string }> {}

export const EditSponsor: FunctionComponent<Props> = ({ match }: Props) => {
    const [sponsor, setSponsor] = useState<SponsorRecord | undefined>(
        undefined
    );
    const token = useStoreState(state => state.token);
    const addAlert = useStoreActions(actions => actions.addAlert);
    const history = useHistory();

    useEffect(() => {
        if (token) {
            SponsorClient.getOne(parseInt(match.params.id), token.data)
                .then(data => {
                    setSponsor(data);
                })
                .catch(error => {
                    addAlert({
                        color: "danger",
                        text: error.message,
                    });
                });
        }
    }, [token, match.params.id, setSponsor]);

    return (
        <div>
            {renderHeader()}
            {renderForm()}
        </div>
    );

    function renderHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader title="Edit Sponsor" />
                </Col>
            </Row>
        );
    }

    async function submitForm(sponsorRequest: SponsorRequest) {
        if (token) {
            try {
                const editedSponsor = await SponsorClient.update({
                    id: parseInt(match.params.id),
                    sponsorRequest: sponsorRequest,
                    token: token.data,
                });
                addAlert({
                    color: "success",
                    text: `${editedSponsor.firstName} ${editedSponsor.lastName} saved successfully.`,
                });
                history.push(`/sponsors/${editedSponsor.id}`);
            } catch (error: any) {
                addAlert({
                    color: "danger",
                    text: error.message,
                });
                scrollToTop();
            }
        }
    }

    function renderForm() {
        return (
            <Row>
                <Col>
                    {sponsor === undefined ? (
                        <LoadingSpinner />
                    ) : (
                        <CreateEditSponsorForm
                            onSubmit={submitForm}
                            existingSponsor={sponsor}
                        />
                    )}
                </Col>
            </Row>
        );
    }
};
