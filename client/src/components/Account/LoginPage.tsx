import { FunctionComponent } from "react";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { Link } from "react-router-dom";
import { LoginForm } from "./LoginForm";

export const LoginPage: FunctionComponent = () => {
    return (
        <div>
            <Row>
                <Col>
                    <PageHeader title="Log In" />
                </Col>
            </Row>
            <Row>
                <Col xs={12} lg={6}>
                    <LoginForm
                        onSubmit={async loginRequest => {
                            try {
                                console.log(loginRequest);
                            } catch (error) {
                                console.error(error);
                            }
                        }}
                    />
                    <hr className="mt-4" />
                    <p>
                        Need an account?{" "}
                        <Link to="/account/register">Register.</Link>
                    </p>
                </Col>
            </Row>
        </div>
    );
};
