import { Fragment, useEffect, FunctionComponent } from "react";
import { io, Socket } from "socket.io-client";

export const SocketConnection: FunctionComponent = () => {
    useEffect(() => {
        const socket: Socket = io("/");
    }, []);

    return <Fragment />;
};
