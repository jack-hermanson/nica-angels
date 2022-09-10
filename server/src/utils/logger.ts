import { ILogObject, Logger } from "tslog";
import axios from "axios";

export const logger = new Logger({
    name: "server",
    minLevel: process.env.NODE_ENV === "production" ? "info" : "silly",
});

async function logToTransport(logObject: ILogObject) {
    try {
        await axios.post(
            process.env.NODE_ENV === "production"
                ? "https://logger.herm.shop/api/logs/new"
                : "http://127.0.0.1:5003/api/logs/new",
            {
                token:
                    process.env.NODE_ENV === "production"
                        ? process.env.LOGGER_TOKEN
                        : "nica-angels",
                level: logObject.logLevelId,
                body: logObject.toJSON(),
            }
        );
    } catch (error) {
        if (process.env.NODE_ENV === "production") {
            console.error("Could not connect to logger.");
            console.error(error);
        }
    }
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
    process.env.NODE_ENV === "production" ? "info" : "debug"
);
