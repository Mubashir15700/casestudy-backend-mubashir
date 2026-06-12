import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers["x-admin-key"];

    if (!apiKey) {
        return next(
            new AppError(401, "Missing admin API key")
        );
    }

    if (apiKey !== process.env.ADMIN_API_KEY) {
        return next(
            new AppError(403, "Invalid admin API key")
        );
    }

    next();
};
