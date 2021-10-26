import { FunctionComponent } from "react";
import { PageHeader } from "jack-hermanson-component-lib";
import { useStoreActions, useStoreState } from "../../store/_store";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared";
import { Col, Row } from "reactstrap";
import { CreateEditStudentForm } from "./CreateEditStudentForm";
import { useHistory } from "react-router-dom";
import { StudentClient } from "../../clients/StudentClient";
import { scrollToTop } from "jack-hermanson-ts-utils";

export const CreateStudent: FunctionComponent = () => {
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
                        title={spanish ? "Nuevo Estudiante" : "New Student"}
                    />
                </Col>
            </Row>
        );
    }

    function renderForm() {
        if (token) {
            return (
                <Row>
                    <Col>
                        <CreateEditStudentForm
                            onSubmit={async studentRequest => {
                                if (token) {
                                    try {
                                        const student =
                                            await StudentClient.createStudent(
                                                studentRequest,
                                                token.data
                                            );
                                        addAlert({
                                            text: `Successfully added student: ${student.firstName}.`,
                                            color: "success",
                                        });
                                        history.push("/students");
                                    } catch (error: any) {
                                        console.error(error);
                                        addAlert({
                                            text: error.message,
                                            color: "danger",
                                        });
                                        console.log(error.response);
                                        scrollToTop();
                                    }
                                }
                            }}
                        />
                    </Col>
                </Row>
            );
        }
    }
};
