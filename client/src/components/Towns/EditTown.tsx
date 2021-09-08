import { FunctionComponent, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared/enums";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { Col, Row } from "reactstrap";
import {
    TownRecord,
    TownRequest,
} from "../../../../shared/resource_models/town";
import { TownClient } from "../../clients/TownClient";
import { useStoreActions, useStoreState } from "../../store/_store";
import { conflictError, HTTP } from "jack-hermanson-ts-utils";
import { CreateEditTownForm } from "./CreateEditTownForm";

interface Props extends RouteComponentProps<{ id: string }> {}

export const EditTown: FunctionComponent<Props> = ({ match }: Props) => {
    useMinClearance(Clearance.ADMIN);

    const [town, setTown] = useState<TownRecord | undefined>(undefined);

    const token = useStoreState(state => state.token);
    const addAlert = useStoreActions(actions => actions.addAlert);

    useEffect(() => {
        if (token) {
            TownClient.getTown(parseInt(match.params.id), token.data)
                .then(data => setTown(data))
                .catch(error => {
                    if (error.response?.status === HTTP.NOT_FOUND) {
                        console.log("404 not found!");
                    }
                    console.error(error.response);
                    addAlert({ text: error.message, color: "danger" });
                });
        }
    }, [setTown]);

    return (
        <div>
            <SettingsTabs />
            {renderHeader()}
            {renderForm()}
        </div>
    );

    function renderHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader title="Edit Town" />
                </Col>
            </Row>
        );
    }

    function renderForm() {
        return (
            <Row>
                <Col>
                    {town ? (
                        <CreateEditTownForm
                            existingTown={town}
                            onSubmit={async townRequest => {
                                await submitForm(townRequest);
                            }}
                        />
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        );
    }

    async function submitForm(townRequest: TownRequest) {
        if (token) {
            try {
                const editedTown = await TownClient.editTown(
                    parseInt(match.params.id),
                    townRequest,
                    token.data
                );
                addAlert({
                    text: `${editedTown.name} edited successfully.`,
                    color: "success",
                });
            } catch (error: any) {
                if (error.response.status === HTTP.CONFLICT) {
                    addAlert({
                        text: conflictError(
                            error.response.data.conflictingProperties,
                            "town"
                        ),
                        color: "danger",
                    });
                } else {
                    addAlert({
                        text: error.message,
                        color: "danger",
                    });
                }
                console.log(error.response);
            }
        }
    }
};
