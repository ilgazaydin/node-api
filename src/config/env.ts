import dotenv from 'dotenv';
import path from 'path';

// Load .env.local or .env based on environment
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
} else {
  dotenv.config(); // defaults to .env in production
}

// Validate required env vars
const required = ['JWT_SECRET', 'DATABASE_URL'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

// Export as constants
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const DATABASE_URL = process.env.DATABASE_URL as string;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const EMAIL_TOKEN_SECRET = process.env.EMAIL_TOKEN_SECRET as string;
export const RESEND_API_KEY = process.env.RESEND_API_KEY as string;
export const APP_URL = process.env.APP_URL || 'http://localhost:8000';
