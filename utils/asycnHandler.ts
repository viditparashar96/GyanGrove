import { NextFunction, Request, Response } from "express";

const asyncHandler = (fn: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
