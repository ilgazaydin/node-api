// src/services/emailService.ts
import { Resend } from "resend";
import jwt from "jsonwebtoken";
import { EMAIL_TOKEN_SECRET, RESEND_API_KEY, APP_URL } from "../config/env";

const resend = new Resend(RESEND_API_KEY);

export function generateEmailToken(userId: string): string {
  return jwt.sign({ userId }, EMAIL_TOKEN_SECRET, { expiresIn: "1d" });
}

export async function sendEmailConfirmation(email: string, token: string) {
  const confirmUrl = `${APP_URL}/verify-email?token=${token}`; // update this

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmUrl}">here</a> to verify your email address.</p>`,
  });
}
