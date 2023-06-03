import { Request, Response } from "express";
import { RoleEnumType, User } from "../entity/user.entity";

export const PermissionMiddleware = (
  req: Request,
  res: Response,
  next: Function
) => {
  const user: User = req["user"];
  if (user["role"] === RoleEnumType.USER) {
    return res.status(403).send({
      errors: { message: "unauthorized" },
    });
  }
  next();
};
