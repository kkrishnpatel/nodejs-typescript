import express, { NextFunction, Request, Response } from "express";
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

// To avoid try and catch block use below middleware
const use = fn =>(req:Request, res:Response, next:NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
}

export const router = express.Router();

//User Route  
router.post("/login",Validate(loginUserSchema), use(Login));
router.post("/register",Validate(createUserSchema), use(Register));
router.post("/login",Validate(loginUserSchema), use(Login));
router.get("/user", AuthMiddleware, use(AuthenticatedUser));
router.put("/user/info", Validate(updateSchema), AuthMiddleware, use(UpdateInfo));
router.patch("/user/password",Validate(passwordSchema), AuthMiddleware, use(UpdatePassword));
//Admin Route
router.get("/users", AuthMiddleware, PermissionMiddleware, use(Users));
router.post("/users", AuthMiddleware, Validate(createSchema), PermissionMiddleware, use(CreateUser));
router.get("/users/:id", AuthMiddleware, PermissionMiddleware, use(GetUser));
router.put("/users/:id", AuthMiddleware, Validate(createSchema), PermissionMiddleware, use(UpdateUser));
router.delete("/users/:id", AuthMiddleware, PermissionMiddleware, use(DeleteUser));

