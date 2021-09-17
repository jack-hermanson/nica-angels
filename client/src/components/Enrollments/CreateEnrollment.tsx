import { FunctionComponent } from "react";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { useStoreActions, useStoreState } from "../../store/_store";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { CreateEditEnrollmentForm } from "./CreateEditEnrollmentForm";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { EnrollmentClient } from "../../clients/EnrollmentClient";
import { scrollToTop } from "jack-hermanson-ts-utils";

interface Props extends RouteComponentProps<{ studentId?: string }> {}

export const CreateEnrollment: FunctionComponent<Props> = ({
    match,
}: Props) => {
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
                        title={spanish ? "Nuevo Inscrito" : "New Enrollment"}
                    />
                </Col>
            </Row>
        );
    }

    function renderForm() {
        const studentId = match.params.studentId
            ? parseInt(match.params.studentId)
            : undefined;
        return (
            <Row>
                <Col>
                    <CreateEditEnrollmentForm
                        onSubmit={async enrollmentRequest => {
                            if (token) {
                                try {
                                    await EnrollmentClient.createEnrollment(
                                        enrollmentRequest,
                                        token.data
                                    );
                                    addAlert({
                                        text: "Enrollment created successfully.",
                                        color: "success",
                                    });
                                    history.push("/settings/enrollments");
                                } catch (error: any) {
                                    console.error(error);
                                    addAlert({
                                        text: error.message,
                                        color: "danger",
                                    });
                                    console.error(error.response);
                                    scrollToTop();
                                }
                            }
                        }}
                        studentId={studentId}
                    />
                </Col>
            </Row>
        );
    }
};
