import { Fragment, useEffect, FunctionComponent } from "react";
import { io, Socket } from "socket.io-client";
import { useStoreState } from "../../store/_store";

export const SocketConnection: FunctionComponent = () => {
    const token = useStoreState(state => state.token);

    useEffect(() => {
        const socket: Socket = io("/");

        socket.on("connect", () => {
            console.log("socket connected on front end");
            if (token) {
                console.log("token available - fetching data");
            }
        });

        socket.on("disconnect", message => {
            console.log("disconnected from socket");
            console.log(message);
        });
    }, [token]);

    return <Fragment />;
};
