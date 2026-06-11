import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Centralized Error Log:", err.message || err);
  
    const statusCode = err.statusCode || 400; 
  
    res.status(statusCode).json({
      success: false,
      data: null,
      error: err.message || "Internal Server Error"
    });
};
