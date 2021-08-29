import { FunctionComponent } from "react";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";

export const RegisterPage: FunctionComponent = () => {
    return (
        <div>
            <Row>
                <Col>
                    <PageHeader title="Register" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>Register</p>
                </Col>
            </Row>
        </div>
    );
};
