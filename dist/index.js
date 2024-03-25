"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const db_config_1 = require("./config/db-config");
const env_config_1 = require("./config/env-config");
const swagger_config_1 = require("./config/swagger-config");
const cors = require("cors");
var cookieParser = require("cookie-parser");
const hello_route = require("./routes/hello-route");
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use(cors());
app.use((0, morgan_1.default)("dev"));
app.use(cookieParser());
app.use("/api/v1", hello_route);
app.use("/api/v1/events", require("./routes/event-route"));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_config_1.specs, { explorer: true }));
app.get("/", (req, res) => {
    res.send("Hello World!");
});
const start = () => {
    try {
        (0, db_config_1.connect_db)();
        app.listen(port, () => {
            console.log(`⚡️[server]: Server is running at ${env_config_1.env_conf.node_env == "dev" ? `http://localhost:${port}` : port} \n📄[docs]: ${env_config_1.env_conf.node_env == "dev" ? `http://localhost:${port}/api-docs` : ""}`);
        });
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
start();
