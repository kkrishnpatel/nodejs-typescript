// set env variable bases on the NODE_ENV variable
require("dotenv").config({
  path: __dirname + `/../.env.${process.env.NODE_ENV}`,
});

import express, { NextFunction, Request, Response } from "express";
import { router } from "./routes";
import { ErrorHandler } from "./utils/errorHandeler";


function createServer() {
  const app = express();
  app.use(express.json());
  app.use("/api", router)

  // if not api routes found then send a 404 response
  app.use("*", (req: Request, res: Response) => {
    ErrorHandler(404, 'You reached a route that is not defined on this server')
  });

  process.on("unhandledRejection", (error: Error) => {
    ErrorHandler(500, error.message)
  });

  // global error handler
  const handelError = (err, req: Request, res: Response, next: NextFunction) => {
    return  res
      .status(err.statusCode || 500)
      .send({ errors: { message: err.message || "something went wrong" } });
  };
  app.use(handelError);
  return app;
}
export default createServer;
