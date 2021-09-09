import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./css/main.css";
import { Layout } from "./components/Layout/Layout";
import { AccountPage } from "./components/Account/AccountPage";
import { DashboardPage } from "./components/Dashboard/DashboardPage";
import { RegisterPage } from "./components/Account/RegisterPage";
import { LoginPage } from "./components/User/LoginPage";
import { useStoreActions } from "./store/_store";
import { LocalStorage } from "./utils/LocalStorage";
import { AccountClient } from "./clients/AccountClient";
import { Alerts } from "./components/Alerts/Alerts";
import { SocketConnection } from "./components/SocketConnection";
import { Settings } from "./components/Settings/Settings";
import { Towns } from "./components/Towns/Towns";
import { CreateTown } from "./components/Towns/CreateTown";
import { EditTown } from "./components/Towns/EditTown";
import { SchoolsIndex } from "./components/Schools/SchoolsIndex";
import { CreateSchool } from "./components/Schools/CreateSchool";

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
                    console.log(error.response.data);
                    LocalStorage.removeToken();
                });
        }
    }, [setToken, setCurrentUser]);

    return (
        <BrowserRouter>
            <SocketConnection />
            <Layout>
                <Alerts />
                <Switch>
                    <Route exact path="/" component={DashboardPage} />

                    <Route exact path="/account" component={AccountPage} />
                    <Route
                        exact
                        path="/account/register"
                        component={RegisterPage}
                    />
                    <Route exact path="/account/login" component={LoginPage} />

                    <Route exact path="/settings" component={Settings} />

                    <Route exact path="/settings/towns" component={Towns} />
                    <Route
                        exact
                        path="/settings/towns/new"
                        component={CreateTown}
                    />
                    <Route
                        exact
                        path="/settings/towns/edit/:id"
                        component={EditTown}
                    />

                    <Route exact path="/schools" component={SchoolsIndex} />
                    <Route exact path="/schools/new" component={CreateSchool} />
                </Switch>
            </Layout>
        </BrowserRouter>
    );
};
