import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

interface JwtPayload {
    sub: string;
}

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return next(
            new AppError(401, "Missing access token")
        );
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload;

        req.userId = decoded.sub;

        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return next(
                new AppError(401, "Access token expired")
            );
        }

        return next(
            new AppError(403, "Invalid token")
        );
    }
};
