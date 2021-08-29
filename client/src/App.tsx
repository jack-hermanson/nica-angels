import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./css/main.css";
import { Layout } from "./components/Layout/Layout";

export const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Layout>
                <p>This is the app</p>
            </Layout>
        </BrowserRouter>
    );
};
