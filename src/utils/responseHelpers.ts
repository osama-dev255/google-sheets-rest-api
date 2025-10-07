import { Response } from 'express';
import { ApiResponse, PaginatedResponse, AppError } from '../types';
import logger from '../config/logger';

/**
 * Create a standardized API response
 */
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  message?: string,
  error?: string
): ApiResponse<T> {
  const response: ApiResponse<T> = {
    success,
    timestamp: new Date().toISOString(),
  };
  
  if (data !== undefined) response.data = data;
  if (message !== undefined) response.message = message;
  if (error !== undefined) response.error = error;
  
  return response;
}

/**
 * Create a standardized paginated API response
 */
export function createPaginatedResponse<T>(
  success: boolean,
  data?: T,
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
  message?: string,
  error?: string
): PaginatedResponse<T> {
  const response: PaginatedResponse<T> = {
    success,
    timestamp: new Date().toISOString(),
  };
  
  if (data !== undefined) response.data = data;
  if (pagination !== undefined) response.pagination = pagination;
  if (message !== undefined) response.message = message;
  if (error !== undefined) response.error = error;
  
  return response;
}

/**
 * Send success response
 */
export function sendSuccessResponse<T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200
): void {
  const response = createApiResponse(true, data, message);
  res.status(statusCode).json(response);
}

/**
 * Send error response
 */
export function sendErrorResponse(
  res: Response,
  error: string,
  statusCode: number = 500,
  data?: any
): void {
  const response = createApiResponse(false, data, undefined, error);
  res.status(statusCode).json(response);
}

/**
 * Send paginated response
 */
export function sendPaginatedResponse<T>(
  res: Response,
  data: T,
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
  message?: string,
  statusCode: number = 200
): void {
  const response = createPaginatedResponse(true, data, pagination, message);
  res.status(statusCode).json(response);
}

/**
 * Create an operational error
 */
export function createAppError(message: string, statusCode: number): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}

/**
 * Handle async errors in route handlers
 */
export function asyncHandler(fn: Function) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Log and format error for response
 */
export function handleError(error: any, req?: any): { message: string; statusCode: number } {
  let message = 'Internal server error';
  let statusCode = 500;

  if (error instanceof Error) {
    message = error.message;
  }

  if (error.statusCode) {
    statusCode = error.statusCode;
  }

  // Log the error with context
  logger.error('Error occurred', {
    message: error.message || error,
    stack: error.stack,
    statusCode,
    url: req?.url,
    method: req?.method,
    ip: req?.ip,
    userAgent: req?.get('User-Agent'),
  });

  return { message, statusCode };
}