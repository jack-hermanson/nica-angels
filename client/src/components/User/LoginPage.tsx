import { FunctionComponent, useEffect } from "react";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { Link, useHistory } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { useStoreActions, useStoreState } from "../../store/_store";
import { LocalStorage } from "../../utils/LocalStorage";

export const LoginPage: FunctionComponent = () => {
    const logIn = useStoreActions(actions => actions.logIn);
    const currentUser = useStoreState(state => state.currentUser);

    const history = useHistory();

    useEffect(() => {
        if (currentUser) {
            const redirectPath = LocalStorage.getRedirectPath();
            if (redirectPath) {
                history.push(redirectPath);
            } else {
                history.push("/account");
            }
        }
    }, [history, currentUser]);

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
                                await logIn(loginRequest);
                                const redirectPath =
                                    LocalStorage.getRedirectPath();
                                if (redirectPath) {
                                    history.push(redirectPath);
                                }
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
