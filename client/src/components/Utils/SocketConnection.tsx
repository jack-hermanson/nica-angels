import { Fragment, useEffect, FunctionComponent } from "react";
import { io, Socket } from "socket.io-client";
import { useStoreActions, useStoreState } from "../../store/_store";

export const SocketConnection: FunctionComponent = () => {
    const token = useStoreState(state => state.token);
    const setConnected = useStoreActions(actions => actions.setConnected);

    useEffect(() => {
        const socket: Socket = io("/");

        socket.on("connect", () => {
            console.log("socket connected on front end");
            setConnected(true);
            if (token) {
                console.log("Connected with token");
            }
        });

        socket.on("disconnect", message => {
            console.log("disconnected from socket");
            console.log(message);
            setConnected(false);
        });
    }, [token, setConnected]);

    return <Fragment />;
};
