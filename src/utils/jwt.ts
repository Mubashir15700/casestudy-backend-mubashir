import jwt from "jsonwebtoken";

export function generateAccessToken(userId: string) {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET!,
    {
      expiresIn: "15m",
    }
  );
}
