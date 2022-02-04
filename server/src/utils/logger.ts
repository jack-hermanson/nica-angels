import { Logger } from "tslog";

export const logger = new Logger({
    name: "server",
    minLevel: process.env.NODE_ENV === "production" ? "info" : "silly",
});
