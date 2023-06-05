import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";
import bcyptjs from "bcryptjs";

export const Users: Function = async (req: Request, res: Response) => {
  const repository = getManager().getRepository(User);
  const data = <User[]>await repository.find({});
  return res.send({
    data,
  });
};

export const CreateUser: Function = async (req: Request, res: Response) => {
  const { name, email, role } = req.body;
  const hashedPassword = <string>await bcyptjs.hash("1234", 10);
  const repository = getManager().getRepository(User);
  const { password, ...user } = <User>await repository.save({
    name,
    email,
    role,
    password: hashedPassword,
  });
  return res.status(201).send(user);
};

export const GetUser: Function = async (req: Request, res: Response) => {
  const repository = getManager().getRepository(User);
  const user = <User>await repository.findOne(req.params.id);
  if (!user) {
    return res.status(204).send({message: "User not found."});
  }
  return res.send(user);
};

export const UpdateUser: Function = async (req: Request, res: Response) => {
  const { name, email, role } = req.body;
  const repository = getManager().getRepository(User);
  const user = <User>await repository.findOne(req.params.id);
  if (!user) {
    return res.status(204).send({ errors: { message: "User not found" } });
  }
  const userData = await repository.save({
    id: +req.params.id,
    name,
    email,
    role,
  });
  return res.status(200).send(userData);
};

export const DeleteUser: Function = async (req: Request, res: Response) => {
  const repository = getManager().getRepository(User);
  const user = <User>await repository.findOne(req.params.id);
  if (!user) {
    return res.status(204).send({message: "User not found."});
  }
  await repository.delete(req.params.id);
  return res.status(200).send({ message: "User deleted successfully" });
};
