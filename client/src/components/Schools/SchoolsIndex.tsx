import { FunctionComponent } from "react";
import { PageHeader } from "jack-hermanson-component-lib";
import { Button, Col, Row } from "reactstrap";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared/enums";
import { useStoreState } from "../../store/_store";
import { NEW_BUTTON_COLOR } from "../../utils/constants";

export const SchoolsIndex: FunctionComponent = () => {
    useMinClearance(Clearance.SPONSOR);

    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);
    const currentUser = useStoreState(state => state.currentUser);

    return <div>{renderHeader()}</div>;

    function renderHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader title={spanish ? "Escuelas" : "Schools"}>
                        {currentUser &&
                            currentUser.clearance >= Clearance.ADMIN && (
                                <Button size="sm" color={NEW_BUTTON_COLOR}>
                                    New
                                </Button>
                            )}
                    </PageHeader>
                </Col>
            </Row>
        );
    }
};
