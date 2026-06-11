import { Request, Response } from "express";
import { loginUser, refreshAccessToken, registerUser } from "./auth.service";

export async function register(req: Request, res: Response) {
  const user = await registerUser(req.body);

  return res.status(201).json({
    success: true,
    data: user,
    error: null,
  });
}

export async function login(req: Request, res: Response) {
  const user = await loginUser(req.body);

  return res.status(200).json({
    success: true,
    data: user,
    error: null,
  });
}

export async function refresh(req: Request, res: Response) {
  const result = await refreshAccessToken(req.body);

  return res.status(200).json({
    success: true,
    data: result,
    error: null,
  });
}
