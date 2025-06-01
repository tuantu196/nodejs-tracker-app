import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import prisma from "../../config/prismaClient.ts";
import jwt from "jsonwebtoken";
import redis from "../../config/redis.ts";
import { loginService } from "./authService.ts";

export const login = async (req: Request, res: Response): Promise<any>  => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const { user, token, refreshToken } = await loginService(email, password);
    return res.status(200).json({
      message: "Login successful",
      user,
      token,
      refreshToken,
    });
  } catch (error: any) {
    if (error.message == "InvalidCredentials") {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Loại bỏ password trước khi trả về client
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.user;
  console.log("Tube email:", email);
  const token = await redis.get(`token:${email}`);
  console.log("Tube token:", token);

  await redis.del(`token:${email}`);
  await redis.del(`refreshToken:${email}`);
  return res.status(200).json({ message: "Logout successful" });
};
export const refresh = (req: Request, res: Response) => {};

export const userInformation = (req: Request, res: Response) => {
  const { email } = req.user;
  console.log("Tube email:1", email);
  prisma.user
    .findUnique({
      where: { email },
    })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      } else {
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({ user: userWithoutPassword });
      }
    });
};
