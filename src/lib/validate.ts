import type { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";

export const validateBody =
  <Output>(schema: ZodType<Output>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Invalid webhook payload",
        issues: result.error.issues,
      });
    }

    req.body = result.data;
    next();
  };
