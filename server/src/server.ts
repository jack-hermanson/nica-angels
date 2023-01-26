import express from "express";
import * as http from "http";
import * as socketio from "socket.io";
import path from "path";
import { config } from "dotenv";
import { ConnectionOptions, createConnection } from "typeorm";
import { DbDialect, aggregateQuery } from "jack-hermanson-ts-utils";
import { models } from "./models/_models";
import { migrations } from "./migrations/_migrations";
import { routes } from "./routes/_routes";
import { logger } from "./utils/logger";

// env
const envPath = path.join(__dirname, "..", ".env");
config({ path: envPath });

// express server
const app = express();
app.use(
    express.json({
        limit: "50mb",
    })
);
app.use(express.urlencoded({ extended: false }));
app.set("port", process.env.PORT || 5002);

// ssl
// app.use(sslRedirect(["production"]));

// static
const staticFiles = express.static(path.join(__dirname, "../../client/build"));
app.use(staticFiles);

// skip & take query strings
app.use(aggregateQuery);

// routes
app.use("/api/accounts", routes.accounts);
app.use("/api/towns", routes.towns);
app.use("/api/schools", routes.schools);
app.use("/api/students", routes.students);
app.use("/api/enrollments", routes.enrollments);
app.use("/api/files", routes.files);
app.use("/api/sponsors", routes.sponsors);
app.use("/api/sponsorships", routes.sponsorships);
app.use("/api/payments", routes.payments);
app.use("/api/reports", routes.reports);

// production redirects
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
    app.get("*", (req, res) => {
        res.sendFile(
            path.resolve(__dirname, "../../client/build", "index.html")
        );
    });
}

function getDatabaseUrl() {
    const env = process.env.NODE_ENV;
    switch (env) {
        case "test":
            return process.env.TEST_DATABASE_URL;
        default:
            return process.env.DATABASE_URL;
    }
}

// database
const databaseDialect = process.env.DATABASE_DIALECT as DbDialect;
console.log({ databaseDialect });
logger.info("[Database URL]", getDatabaseUrl());
export const dbOptions: ConnectionOptions = {
    database: databaseDialect === "sqlite" ? "site.db" : "",
    type: databaseDialect,
    url: getDatabaseUrl(),
    entities: models,
    synchronize: false,
    extra: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
    migrationsRun: true,
    migrationsTableName: "migrations",
    migrations: migrations,
    cli: {
        migrationsDir: path.join(__dirname, "migrations"),
    },
};
createConnection(dbOptions)
    .then(connection => {
        logger.info(
            `Connected to database with type: ${connection.options.type}.`
        );
    })
    .catch(error => {
        console.error(error);
    });

// http server and socket
const server = http.createServer(app);
const io = new socketio.Server({
    cors: {
        origin: "*",
    },
});
io.attach(server);
app.set("socketio", io);

// listen
server.listen(app.get("port"), () => {
    logger.info(`Running in environment: ${process.env.NODE_ENV}.`);
    logger.info(`Server is listening on port ${app.get("port")}.`);
});
