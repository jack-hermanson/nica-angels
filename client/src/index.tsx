import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { StoreProvider } from "easy-peasy";
import { store } from "./store/_store";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
    <React.Fragment>
        <StoreProvider store={store}>
            <App />
        </StoreProvider>
    </React.Fragment>,
    document.getElementById("root")
);
serviceWorker.register();
