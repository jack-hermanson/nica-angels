import { FunctionComponent } from "react";
import { NavTabs } from "jack-hermanson-component-lib";
import { Col, Row } from "reactstrap";
import { useStoreState } from "../../store/_store";

export const StudentTabs: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);

    return (
        <Row>
            <Col>
                <NavTabs
                    links={[
                        {
                            text: spanish ? "Estudiantes" : "Students",
                            path: "/students",
                        },
                        {
                            text: spanish ? "Inscritos" : "Enrollments",
                            path: "/enrollments",
                        },
                    ]}
                />
            </Col>
        </Row>
    );
};
