import { NextFunction, Request, Response, Router } from "express";
import {
  AuthenticatedUser,
  Login,
  Register,
  UpdateInfo,
  UpdatePassword,
} from "./controller/auth.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";
import {
  CreateUser,
  DeleteUser,
  GetUser,
  UpdateUser,
  Users,
} from "./controller/user.controller";
import { PermissionMiddleware } from "./middleware/permission.middleware";
import { createSchema, createUserSchema, loginUserSchema, passwordSchema, updateSchema } from "./schemas/user.schema";
import { Validate } from "./middleware/validate";

const use = fn =>(req:Request, res:Response, next:NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
}

export const routes = (router: Router) => {
  router.post("/api/register",Validate(createUserSchema), use(Register));
  router.get("/api/login",Validate(loginUserSchema), use(Login));
  router.get("/api/user", AuthMiddleware, use(AuthenticatedUser));
  router.put("/api/user/info", Validate(updateSchema), AuthMiddleware, use(UpdateInfo));
  router.patch("/api/user/password",Validate(passwordSchema), AuthMiddleware, use(UpdatePassword));

  router.get("/api/users", AuthMiddleware, PermissionMiddleware, use(Users));
  router.post("/api/users", AuthMiddleware, Validate(createSchema), PermissionMiddleware, use(CreateUser));
  router.get("/api/users/:id", AuthMiddleware, PermissionMiddleware, use(GetUser));
  router.put("/api/users/:id", AuthMiddleware, PermissionMiddleware, use(UpdateUser));
  router.delete("/api/users/:id", AuthMiddleware, PermissionMiddleware, use(DeleteUser));
};
