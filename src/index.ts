require("dotenv").config();

import express, { NextFunction, Request, Response } from "express";
import { routes } from "./routes";
import { createConnection } from "typeorm";

const app = express();
app.use(express.json());

//Need to update CRM version and connections
createConnection().then((connection) => {
  console.log("connection successful");
});

routes(app);
app.use("*", (req:Request, res:Response) => {
  res.status(404).json({
    message: "You reached a route that is not defined on this server",
  });
});

process.on("unhandledRejection", (error: Error) => {
  throw new Error(error.message);
});

const handelError = (err, req:Request, res:Response, next:NextFunction) => {
  res
    .status(err.statusCode || 500)
    .send({ errors: { message: err.message || "something went wrong" } });
};
app.use(handelError);
app.listen(8000, () => {
  console.log("listening on port 8000");
});
