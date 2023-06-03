import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = <string>req.headers["access_token"];
    const payload: any = verify(token, process.env.TOKEN_KEY);
    if (!payload) {
      return res.status(401).send({
        message: "unauthenticated",
      });
    }
    const repository = getManager().getRepository(User);
    const user: User = <User>await repository.findOne(payload.id);
    req["user"] = user;
    next();
  } catch (e: any) {
    return res.status(401).send({
      message: "unauthenticated",
    });
  }
};
