import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateEmailConstraints } from '../utils/validators';

/**
 * Zod schema for email validation
 */
const whitelistSchema = z.object({
  email: z.string().min(1, 'Email is required'),
});

/**
 * Middleware to validate whitelist request body
 */
export const validateWhitelistRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Validate with Zod schema
    const result = whitelistSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    // Additional email validation
    const { email } = result.data;
    const emailValidation = validateEmailConstraints(email);

    if (!emailValidation.valid) {
      res.status(400).json({
        success: false,
        message: emailValidation.error || 'Invalid email',
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
