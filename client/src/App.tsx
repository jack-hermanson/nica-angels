import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./css/main.css";
import { Layout } from "./components/Layout/Layout";
import { AccountPage } from "./components/Account/AccountPage";
import { DashboardPage } from "./components/Dashboard/DashboardPage";
import { RegisterPage } from "./components/Account/RegisterPage";
import { LoginPage } from "./components/Account/LoginPage";

export const App: React.FC = () => {
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
