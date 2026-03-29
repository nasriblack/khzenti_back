import { Request, Response, NextFunction } from 'express';
import { whitelistService } from '../services/whitelist.service';
import { getClientIp } from '../utils/ipHelper';
import { SuccessResponse } from '../types';

/**
 * Controller for whitelist operations
 */
export class WhitelistController {
  /**
   * Handle POST /api/whitelist
   * Add email to whitelist
   */
  async addToWhitelist(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;
      const ipAddress = getClientIp(req);
      const userAgent = req.headers['user-agent'];

      const result = await whitelistService.addToWhitelist(
        email,
        ipAddress,
        userAgent
      );

      if (!result.success) {
        res.status(result.statusCode || 500).json({
          success: false,
          message: result.error || 'Failed to add email to whitelist',
        });
        return;
      }

      const response: SuccessResponse = {
        success: true,
        message: 'Successfully added to whitelist',
        data: {
          email: result.data?.email,
        },
      };

      res.status(result.statusCode || 201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle GET /api/whitelist
   * Get all whitelist entries (admin endpoint)
   */
  async getAllEntries(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await whitelistService.getAllWhitelistEntries();

      if (!result.success) {
        res.status(result.statusCode || 500).json({
          success: false,
          message: result.error || 'Failed to fetch whitelist entries',
        });
        return;
      }

      const response: SuccessResponse = {
        success: true,
        message: 'Whitelist entries retrieved successfully',
        data: result.data,
      };

      res.status(result.statusCode || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle GET /api/whitelist/check/:email
   * Check if email exists in whitelist
   */
  // async checkEmail(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   try {
  //     const { email } = req.params;

  //     const result = await whitelistService.checkEmail(email);

  //     if (!result.success) {
  //       res.status(result.statusCode || 500).json({
  //         success: false,
  //         message: result.error || 'Failed to check email',
  //       });
  //       return;
  //     }

  //     const response: SuccessResponse = {
  //       success: true,
  //       message: 'Email check completed',
  //       data: result.data,
  //     };

  //     res.status(result.statusCode || 200).json(response);
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}

export const whitelistController = new WhitelistController();
