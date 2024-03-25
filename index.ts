import express, { Express, Request, Response } from "express";
import logger from "morgan";
import swaggerUi from "swagger-ui-express";
import { connect_db } from "./config/db-config";
import { env_conf } from "./config/env-config";
import { specs } from "./config/swagger-config";
const cors = require("cors");
var cookieParser = require("cookie-parser");
const hello_route = require("./routes/hello-route");
const app: Express = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cors());
app.use(logger("dev"));

app.use(cookieParser());

app.use("/api/v1/events", require("./routes/event-route"));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Api is Working!!!");
});

const start = (): void => {
  try {
    connect_db();
    app.listen(port, () => {
      console.log(
        `⚡️[server]: Server is running at ${
          env_conf.node_env == "dev" ? `http://localhost:${port}` : port
        } \n📄[docs]: ${
          env_conf.node_env == "dev" ? `http://localhost:${port}/api-docs` : ""
        }`
      );
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
start();
