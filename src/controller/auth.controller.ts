import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";
import bcyptjs from "bcryptjs";
import { sign } from "jsonwebtoken";
import { ErrorHandler } from "../utils/errorHandeler";

export const Register: Function = async (req: Request, res: Response) => {
  const { name, email, password, role } = <User>req.body;
  const repository = getManager().getRepository(User);
  const isUserExist = <User>await repository.findOne({ email });
  if (isUserExist) {
    ErrorHandler(409, 'User Already Exist. Please Login')
  }
  const { password: removedPassword, ...user } = <User>await repository.save({
    name,
    email,
    role,
    password: await bcyptjs.hash(password, 10),
  });
  res.status(201).send(user);
};

export const Login: Function = async (req: Request, res: Response) => {
  const repository = getManager().getRepository(User);
  const { email } = <User>req.body;
  const user = <User>await repository.findOne(
    {
      email,
    },
    {
      select: ["name", "password", "role", "id"],
    }
  );
  if (!user) {
    ErrorHandler(400, 'invalid credentials!')
  }
  const isPasswordMatch = <Boolean>(
    await bcyptjs.compare(req.body.password, user.password)
  );
  if (!isPasswordMatch) {
    ErrorHandler(400, 'invalid credentials!')
  }
  const { name, role, id } = <User>user;
  const token = <String>sign({ id, name, email }, process.env.TOKEN_KEY, {
    expiresIn: "2h",
  });
  res.send({
    name,
    email,
    role,
    token: token,
  });
};

export const AuthenticatedUser: Function = async (
  req: Request,
  res: Response
) => {
  res.send(req["user"]);
};

export const UpdateInfo: Function = async (req: Request, res: Response) => {
  const user = <User>req["user"];
  const repository = getManager().getRepository(User);
  const { name, email } = <User>req.body;
  await repository.update(user.id, { name, email });
  const data = <User>await repository.findOne(user.id);
  res.send(data);
};

export const UpdatePassword: Function = async (req: Request, res: Response) => {
  const user = <User>req["user"];
  const repository = getManager().getRepository(User);

  await repository.update(user.id, {
    password: await bcyptjs.hash(req.body.password, 10),
  });
  res.status(200).send(user);
};
