import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { whitelistController } from "./controllers/whitelist.controller";
import { validateWhitelistRequest } from "./middleware/validation.middleware";
import {
  apiLimiter,
  whitelistLimiter,
} from "./middleware/rateLimit.middleware";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/errorHandler.middleware";
import { adminAuth } from "./middleware/auth.middleware";

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:3000",
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply global rate limiter
//TODO:UNDO THIS
app.use("/api/", apiLimiter);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Whitelist routes
app.post(
  "/api/whitelist",
  //TODO: undo this
  whitelistLimiter,
  validateWhitelistRequest,
  whitelistController.addToWhitelist.bind(whitelistController),
);

app.post(
  "/api/whitelist/admin",
  adminAuth,
  whitelistController.getAllEntries.bind(whitelistController),
);

// app.get(
//   '/api/whitelist/check/:email',
//   whitelistController.checkEmail.bind(whitelistController)
// );

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

export default app;
