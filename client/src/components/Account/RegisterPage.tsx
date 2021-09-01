import { FunctionComponent, useEffect } from "react";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { useHistory } from "react-router-dom";
import { RegisterForm } from "./RegisterForm";
import { AccountClient } from "../../clients/AccountClient";

export const RegisterPage: FunctionComponent = () => {
    const currentUser = useStoreState(state => state.currentUser);
    const history = useHistory();

    useEffect(() => {
        if (currentUser) {
            history.replace("/account");
        }
    }, [currentUser, history]);

    return (
        <div>
            <Row>
                <Col>
                    <PageHeader title="Register" />
                </Col>
            </Row>
            <Row>
                <Col xs={12} lg={6}>
                    <RegisterForm
                        onSubmit={async registerRequest => {
                            try {
                                console.log({ registerRequest });
                                const newAccount = await AccountClient.register(
                                    registerRequest
                                );
                                console.log({ newAccount });
                            } catch (error) {
                                console.error(error);
                            }
                        }}
                    />
                </Col>
                <Col xs={12} lg={6}>
                    <hr className="d-lg-none mt-4" />
                    <p>Already have an account?</p>
                </Col>
            </Row>
        </div>
    );
};
