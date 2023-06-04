// require("dotenv").config();
require('dotenv').config({path:__dirname+`/../.env.${process.env.NODE_ENV}`})

import express, { NextFunction, Request, Response } from "express";
import { routes } from "./routes";
function createServer() {
  const app = express();
  app.use(express.json());
  app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello world!");
  });
  routes(app);
  app.use("*", (req: Request, res: Response) => {
    res.status(404).json({
      message: "You reached a route that is not defined on this server",
    });
  });

  process.on("unhandledRejection", (error: Error) => {
    throw new Error(error.message);
  });

  const handelError = (
    err,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res
      .status(err.statusCode || 500)
      .send({ errors: { message: err.message || "something went wrong" } });
  };
  app.use(handelError);
  return app;
}
export default createServer;
