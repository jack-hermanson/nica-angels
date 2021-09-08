import { FunctionComponent } from "react";
import { PageHeader } from "jack-hermanson-component-lib";
import { Col, Row } from "reactstrap";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared/enums";
import { useStoreState } from "../../store/_store";

export const SchoolsIndex: FunctionComponent = () => {
    useMinClearance(Clearance.SPONSOR);

    const spanish = useStoreState(state => state.spanish);

    return (
        <div>
            <Row>
                <Col>
                    <PageHeader title={spanish ? "Escuelas" : "Schools"} />
                </Col>
            </Row>
        </div>
    );
};
