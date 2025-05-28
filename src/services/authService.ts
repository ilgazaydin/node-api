import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { sendEmailConfirmation, generateEmailToken } from "./emailService";
const JWT_EXPIRES_IN = "1d";

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

  return generateToken(user.id);
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  if (!user.isEmailVerified) {
    throw new Error("Please verify your email before logging in.");
  }

  return generateToken(user.id);
}

export function generateToken(userId: string) {
  console.log("JWT_SECRET :>> ", JWT_SECRET);
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
}
