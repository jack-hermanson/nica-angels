import { FunctionComponent, useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance, EnrollmentRecord } from "@nica-angels/shared";
import { useStoreActions, useStoreState } from "../../store/_store";
import { EnrollmentClient } from "../../clients/EnrollmentClient";
import { Col, Row } from "reactstrap";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { CreateEditEnrollmentForm } from "./CreateEditEnrollmentForm";
import { StudentTabs } from "../Students/StudentTabs";

interface Props extends RouteComponentProps<{ id: string }> {}

export const EditEnrollment: FunctionComponent<Props> = ({ match }: Props) => {
    useMinClearance(Clearance.ADMIN);

    const token = useStoreState(state => state.token);
    const spanish = useStoreState(state => state.spanish);

    const addAlert = useStoreActions(actions => actions.addAlert);

    const history = useHistory();

    const [enrollment, setEnrollment] = useState<EnrollmentRecord | undefined>(
        undefined
    );

    useEffect(() => {
        if (token) {
            EnrollmentClient.getEnrollment(
                parseInt(match.params.id),
                token.data
            )
                .then(data => {
                    setEnrollment(data);
                })
                .catch((error: any) => {
                    addAlert({
                        text: error.message,
                        color: "danger",
                    });
                });
        }
    }, [token, setEnrollment, addAlert, match.params.id]);

    return (
        <div>
            <StudentTabs />
            {renderHeader()}
            <Row>
                <Col>
                    {enrollment && token ? (
                        <CreateEditEnrollmentForm
                            onSubmit={async enrollmentRequest => {
                                try {
                                    await EnrollmentClient.updateEnrollment({
                                        id: parseInt(match.params.id),
                                        enrollmentRequest,
                                        token: token.data,
                                    });
                                    addAlert({
                                        text: "Enrollment edited successfully",
                                        color: "success",
                                    });
                                    history.push("/enrollments");
                                } catch (error: any) {
                                    addAlert({
                                        text: error.message,
                                        color: "danger",
                                    });
                                }
                            }}
                            existingEnrollment={enrollment}
                        />
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        </div>
    );

    function renderHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader
                        title={`${spanish ? "Editar" : "Edit"} Enrollment`}
                    />
                </Col>
            </Row>
        );
    }
};
