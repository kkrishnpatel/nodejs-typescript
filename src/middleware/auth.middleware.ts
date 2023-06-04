import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";
import { ErrorHandler } from "../utils/errorHandeler";

// To avoid try and catch block use below middleware
const use = fn =>(req:Request, res:Response, next:NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
}
export const AuthMiddleware = use(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = <string>req.headers["access_token"];
    const payload: any = verify(token, process.env.TOKEN_KEY);
    if (!payload) {
      ErrorHandler(401, "unauthorized");
    }
    const repository = getManager().getRepository(User);
    const user: User = <User>await repository.findOne(payload.id);
    req["user"] = user;
    next();
  } catch (e: any) {
    ErrorHandler(401, "unauthorized");
  }
});