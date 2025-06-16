import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { sendEmailConfirmation, generateEmailToken } from "./emailService";

const JWT_EXPIRES_IN = "10m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) throw new Error("User not found");

    return generateToken(user.id);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
}

export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already registered");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, firstName, lastName },
  });

  const emailToken = generateEmailToken(user.id);
  await sendEmailConfirmation(user.email, emailToken);

  return { message: "Registration successful. Please verify your email before logging in." };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  if (!user.isEmailVerified) {
    throw new Error("Please verify your email before logging in.");
  }

  const accessToken = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { accessToken, refreshToken };
}
