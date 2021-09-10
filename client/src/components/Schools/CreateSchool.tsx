import { FunctionComponent } from "react";
import { PageHeader } from "jack-hermanson-component-lib";
import { useStoreActions, useStoreState } from "../../store/_store";
import { Button, Col, Row } from "reactstrap";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared/enums";
import { useHistory } from "react-router-dom";
import { CreateEditSchoolForm } from "./CreateEditSchoolForm";
import { SchoolRequest } from "../../../../shared/resource_models/school";
import { SchoolClient } from "../../clients/SchoolClient";
import { conflictError, HTTP, scrollToTop } from "jack-hermanson-ts-utils";

export const CreateSchool: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);
    const addAlert = useStoreActions(actions => actions.addAlert);

    const history = useHistory();

    useMinClearance(Clearance.ADMIN);

    return (
        <div>
            {renderTitle()}
            {renderForm()}
        </div>
    );

    function renderTitle() {
        return (
            <Row>
                <Col>
                    <PageHeader
                        title={spanish ? "Nueva Escuela" : "New School"}
                    >
                        <Button
                            size="sm"
                            color="secondary"
                            onClick={() => {
                                history.push("/schools");
                            }}
                        >
                            {spanish ? "Regresar" : "Go Back"}
                        </Button>
                    </PageHeader>
                </Col>
            </Row>
        );
    }

    function renderForm() {
        return (
            <Row>
                <Col xs={12} lg={6}>
                    <CreateEditSchoolForm onSubmit={submit} />
                </Col>
            </Row>
        );
    }

    async function submit(schoolRequest: SchoolRequest) {
        if (token) {
            try {
                const school = await SchoolClient.createSchool(
                    schoolRequest,
                    token.data
                );
                addAlert({
                    text: `${school.name} created successfully.`,
                    color: "success",
                });
                history.push("/schools");
            } catch (error: any) {
                console.error(error);
                const errorText =
                    error.response.status === HTTP.CONFLICT
                        ? conflictError(
                              error.response.data.conflictingProperties,
                              "school"
                          )
                        : error.message;
                addAlert({
                    text: errorText,
                    color: "danger",
                });
                scrollToTop();
            }
        }
    }
};
