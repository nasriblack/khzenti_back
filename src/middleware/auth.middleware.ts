import { Request, Response, NextFunction } from 'express';

/**
 * Simple authentication middleware with hardcoded credentials
 * For production, use proper authentication (JWT, OAuth, etc.)
 */
export const adminAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  // Hardcoded admin credentials
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@khzenti.com';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

  if (!email || !password) {
    res.status(401).json({
      success: false,
      message: 'Email and password are required',
    });
    return;
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    res.status(403).json({
      success: false,
      message: 'Invalid credentials',
    });
    return;
  }

  next();
};
