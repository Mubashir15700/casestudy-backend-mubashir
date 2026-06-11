import bcrypt from "bcrypt";
import crypto from 'crypto';
import { prisma } from "../../config/db";
import { LoginDto, RegisterDto, RefreshDto } from "./auth.validation";
import { generateAccessToken } from "../../utils/jwt";
import { generateRefreshToken } from "../../utils/token";

export async function registerUser(data: RegisterDto) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
      },
    });

    await tx.wallet.create({
      data: {
        userId: createdUser.id,
      },
    });

    return createdUser;
  });

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
  };
}

export async function loginUser(data: LoginDto) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const passwordMatch = await bcrypt.compare(
    data.password,
    user.passwordHash
  );

  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user.id);

  const refreshToken = generateRefreshToken();

  const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
  };
}

export async function refreshAccessToken(
  data: RefreshDto
) {
  const tokenHash = crypto
    .createHash("sha256")
    .update(data.refreshToken)
    .digest("hex");

  const storedToken =
    await prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
      },
    });

  if (!storedToken) {
    throw new Error("Invalid refresh token");
  }

  if (storedToken.expiresAt < new Date()) {
    throw new Error("Refresh token expired");
  }

  const accessToken = generateAccessToken(storedToken.userId);

  const newRefreshToken = generateRefreshToken();

  const newTokenHash = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  const expiresAt = new Date();
  expiresAt.setDate(
    expiresAt.getDate() + 7
  );

  await prisma.$transaction(async (tx) => {
    await tx.refreshToken.update({
      where: {
        id: storedToken.id,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    await tx.refreshToken.create({
      data: {
        userId: storedToken.userId,
        tokenHash: newTokenHash,
        expiresAt,
      },
    });
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
}
