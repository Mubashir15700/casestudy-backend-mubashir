import { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: any) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(422).json({
          success: false,
          data: null,
          error: error.flatten(),
        });
      }

      next(error);
    }
};
