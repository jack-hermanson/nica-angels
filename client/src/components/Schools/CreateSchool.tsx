import { FunctionComponent } from "react";
import { PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { Button, Col, Row } from "reactstrap";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared/enums";
import { useHistory } from "react-router-dom";
import { CreateEditSchoolForm } from "./CreateEditSchoolForm";

export const CreateSchool: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);

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
                    <CreateEditSchoolForm
                        onSubmit={async schoolRequest => {
                            console.log(schoolRequest);
                        }}
                    />
                </Col>
            </Row>
        );
    }
};
