import { FunctionComponent } from "react";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { Link } from "react-router-dom";

export const LoginPage: FunctionComponent = () => {
    return (
        <div>
            <Row>
                <Col>
                    <PageHeader title="Log In" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>Log in.</p>
                    <p>
                        Need an account?{" "}
                        <Link to="/account/register">Register.</Link>
                    </p>
                </Col>
            </Row>
        </div>
    );
};
