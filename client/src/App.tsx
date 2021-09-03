import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./css/main.css";
import { Layout } from "./components/Layout/Layout";
import { AccountPage } from "./components/Account/AccountPage";
import { DashboardPage } from "./components/Dashboard/DashboardPage";
import { RegisterPage } from "./components/Account/RegisterPage";
import { LoginPage } from "./components/Account/LoginPage";
import { useStoreActions } from "./store/_store";
import { LocalStorage } from "./utils/LocalStorage";
import { AccountClient } from "./clients/AccountClient";

export const App: React.FC = () => {
    const setToken = useStoreActions(actions => actions.setToken);
    const setCurrentUser = useStoreActions(actions => actions.setCurrentUser);

    useEffect(() => {
        const token = LocalStorage.getToken();
        if (token) {
            setToken(token);
            AccountClient.getAccount(token.accountId, token.data)
                .then(user => {
                    setCurrentUser(user);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [setToken, setCurrentUser]);

    return (
        <BrowserRouter>
            <Layout>
                <Switch>
                    <Route exact path="/" component={DashboardPage} />

                    <Route exact path="/account" component={AccountPage} />
                    <Route
                        exact
                        path="/account/register"
                        component={RegisterPage}
                    />
                    <Route exact path="/account/login" component={LoginPage} />
                </Switch>
            </Layout>
        </BrowserRouter>
    );
};
