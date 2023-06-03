import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const Validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        params: req.params,
        query: req.query,
        body: req.body,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          errors: error.errors.map((err) => {
            return { message: err.message };
          }),
        });
      }
      next(error);
    }
  };
