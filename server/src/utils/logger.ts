import { ILogLevel, ILogObject, Logger } from "tslog";
import axios from "axios";

export const logger = new Logger({
    name: "server",
    minLevel: process.env.NODE_ENV === "production" ? "info" : "silly",
});

async function logToTransport(logObject: ILogObject) {
    await axios.post(
        process.env.NODE_ENV === "production"
            ? "https://jack-logger.herokuapp.com/api/logs/new"
            : "http://127.0.0.1:8000/api/logs/new",
        {
            token:
                process.env.NODE_ENV === "production"
                    ? process.env.LOGGER_TOKEN
                    : "nica-angels",
            level: logObject.logLevelId,
            body: logObject.toJSON(),
        }
    );
}

logger.attachTransport(
    {
        silly: logToTransport,
        debug: logToTransport,
        trace: logToTransport,
        info: logToTransport,
        warn: logToTransport,
        error: logToTransport,
        fatal: logToTransport,
    },
    "debug"
);
