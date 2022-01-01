import { FunctionComponent, useEffect } from "react";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { useStoreActions, useStoreState } from "../../store/_store";
import { useHistory, Link } from "react-router-dom";
import { RegisterForm } from "./RegisterForm";
import { AccountClient } from "../../clients/AccountClient";

export const RegisterPage: FunctionComponent = () => {
    const currentUser = useStoreState(state => state.currentUser);
    const history = useHistory();
    const logIn = useStoreActions(actions => actions.logIn);
    const spanish = useStoreState(state => state.spanish);

    useEffect(() => {
        if (currentUser) {
            history.replace("/account");
        }
    }, [currentUser, history]);

    return (
        <div>
            <Row>
                <Col>
                    <PageHeader title={spanish ? "Registrar" : "Register"} />
                </Col>
            </Row>
            <Row>
                <Col xs={12} lg={6}>
                    <RegisterForm
                        onSubmit={async registerRequest => {
                            try {
                                const newAccount = await AccountClient.register(
                                    registerRequest
                                );
                                await logIn({
                                    email: newAccount.email,
                                    password: registerRequest.password,
                                });
                                history.replace("/account");
                            } catch (error) {
                                console.error(error);
                            }
                        }}
                    />
                    <hr className="mt-4" />
                    <p>
                        {spanish
                            ? "¿Ya tiene una cuenta?"
                            : "Already have an account?"}{" "}
                        <Link to="/account/login">
                            {spanish ? "Iniciar sesión." : "Log in."}
                        </Link>
                    </p>
                </Col>
            </Row>
        </div>
    );
};
