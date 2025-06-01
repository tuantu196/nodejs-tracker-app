import { refresh } from "./authController";
import prisma from "../../config/prismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redis from "../../config/redis";
import { User } from "../../generated/prisma";

export const loginService = async (email: string, password: string): Promise<{ user: Omit<User, "password">, token: string, refreshToken: string}> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("InvalidCredentials");
  }
    
  const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new Error("InvalidCredentials");
    }


  const token = jwt.sign({ email, id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign({ email }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  await redis.set(`token:${email}`, token, "EX", 60 * 60 * 1); // 1 hour
  await redis.set(
    `refreshToken:${email}`,
    refreshToken,
    "EX",
    60 * 60 * 24 * 7
  ); // 7 days

  // Loại bỏ password trước khi trả về client
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token, refreshToken };
};
