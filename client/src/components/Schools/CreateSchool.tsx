import { FunctionComponent } from "react";
import { PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { Button, Col, Row } from "reactstrap";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared/enums";

export const CreateSchool: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);

    useMinClearance(Clearance.ADMIN);

    return <div>{renderTitle()}</div>;

    function renderTitle() {
        return (
            <Row>
                <Col>
                    <PageHeader
                        title={spanish ? "Nueva Escuela" : "New School"}
                    >
                        <Button size="sm" color="secondary">
                            {spanish ? "Regresar" : "Go Back"}
                        </Button>
                    </PageHeader>
                </Col>
            </Row>
        );
    }
};
