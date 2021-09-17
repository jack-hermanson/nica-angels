import { FunctionComponent } from "react";
import { PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared/enums";
import { Col, Row } from "reactstrap";
import { CreateEditStudentForm } from "./CreateEditStudentForm";

export const CreateStudent: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

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
                                console.log(studentRequest);
                            }}
                        />
                    </Col>
                </Row>
            );
        }
    }
};
