import { FunctionComponent } from "react";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { PageHeader } from "jack-hermanson-component-lib";
import { useStoreActions, useStoreState } from "../../store/_store";
import { Col, Row } from "reactstrap";
import { CreateEditTownForm } from "./CreateEditTownForm";
import { TownRequest } from "../../../../shared";
import { TownClient } from "../../clients/TownClient";
import { useHistory } from "react-router-dom";
import { conflictError, HTTP, scrollToTop } from "jack-hermanson-ts-utils";

export const CreateTown: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);
    const addAlert = useStoreActions(actions => actions.addAlert);

    const history = useHistory();

    return (
        <div>
            <SettingsTabs />
            {renderHeader()}
            <Row>
                <Col xs={12} lg={6}>
                    <CreateEditTownForm
                        onSubmit={async (townRequest: TownRequest) => {
                            if (token) {
                                try {
                                    const newTown = await TownClient.createTown(
                                        townRequest,
                                        token.data
                                    );
                                    addAlert({
                                        text: `${newTown.name} created successfully.`,
                                        color: "success",
                                    });
                                    history.push("/settings/towns");
                                } catch (error: any) {
                                    console.error(error);
                                    const errorText =
                                        error.response.status === HTTP.CONFLICT
                                            ? conflictError(
                                                  error.response.data
                                                      .conflictingProperties,
                                                  "town"
                                              )
                                            : error.message;
                                    addAlert({
                                        text: errorText,
                                        color: "danger",
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

    function renderHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader title={spanish ? "Nuevo Pueblo" : "New Town"} />
                </Col>
            </Row>
        );
    }
};
