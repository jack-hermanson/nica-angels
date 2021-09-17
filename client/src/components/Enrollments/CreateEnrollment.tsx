import { FunctionComponent } from "react";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { useStoreState } from "../../store/_store";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { CreateEditEnrollmentForm } from "./CreateEditEnrollmentForm";
import { RouteComponentProps } from "react-router-dom";

interface Props extends RouteComponentProps<{ studentId?: string }> {}

export const CreateEnrollment: FunctionComponent<Props> = ({
    match,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);

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
                            console.log(enrollmentRequest);
                        }}
                        studentId={studentId}
                    />
                </Col>
            </Row>
        );
    }
};
