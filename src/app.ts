import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import { globalRateLimiter, authRateLimiter } from "./middleware/rateLimiter";

dotenv.config({ path: ".env.local" });
console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:8000",
      "https://nasa-media-explorer-alpha.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Apply global rate limiter to all routes
app.use(globalRateLimiter);

// Apply stricter limiter to auth routes
app.use("/api/auth/login", authRateLimiter);
app.use("/api/auth/register", authRateLimiter);

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (_, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
