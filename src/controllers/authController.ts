import { Request, Response } from "express";
import * as authService from "../services/authService";
import prisma from "../config/prisma";
import { AuthRequest } from "../middleware/authMiddleware";
import { EMAIL_TOKEN_SECRET } from "../config/env";
import jwt from "jsonwebtoken";

export async function register(req: Request, res: Response) {
  const { email, password, firstName, lastName } = req.body;
  try {
    const token = await authService.registerUser(
      email,
      password,
      firstName,
      lastName
    );
    res.json({ token });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const token = await authService.loginUser(email, password);
    res.json({ token });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function me(req: AuthRequest, res: Response) {
  console.log('User ID:', req.userId);
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true, firstName: true, lastName: true, createdAt: true },
  });
  res.json(user);
}

export async function verifyEmail(req: Request, res: Response) {
  const token = req.query.token as string;
  try {
    const { userId } = jwt.verify(token, EMAIL_TOKEN_SECRET) as { userId: string };

    await prisma.user.update({
      where: { id: userId },
      data: { isEmailVerified: true },
    });

    res.json({ message: "Email verified successfully" });
  } catch (err: any) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
}