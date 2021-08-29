import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./css/main.css";
import { Layout } from "./components/Layout/Layout";
import { useStoreState } from "./store/_store";

export const App: React.FC = () => {
    const spanish = useStoreState(state => state.spanish);

    return (
        <BrowserRouter>
            <Layout>{renderPlaceholder()}</Layout>
        </BrowserRouter>
    );

    function renderPlaceholder() {
        return <p>{spanish ? "Ésta es la aplicación." : "This is the app."}</p>;
    }
};
