import { Request } from 'express';

/**
 * Request body for whitelist email submission
 */
export interface WhitelistRequestBody {
  email: string;
}

/**
 * Extended Request type with typed body
 */
export interface WhitelistRequest extends Request {
  body: WhitelistRequestBody;
}

/**
 * Success response structure
 */
export interface SuccessResponse<T = any> {
  success: true;
  message: string;
  data?: T;
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Whitelist data transfer object
 */
export interface WhitelistDTO {
  id: string;
  email: string;
  createdAt: Date;
}

/**
 * API Response type
 */
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

/**
 * Service result for operations
 */
export interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}
