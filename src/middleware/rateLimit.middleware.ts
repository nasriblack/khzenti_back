import rateLimit from 'express-rate-limit';

/**
 * Rate limiter configuration
 * Limits requests to 5 per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 5, // 5 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip successful requests from rate limit count
  skipSuccessfulRequests: false,
  // Skip failed requests from rate limit count
  skipFailedRequests: false,
});

/**
 * Strict rate limiter for whitelist endpoint
 * More restrictive to prevent abuse
 */
export const whitelistLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 requests per 15 minutes
  message: {
    success: false,
    message: 'You have exceeded the whitelist submission limit. Please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
