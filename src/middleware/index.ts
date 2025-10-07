import { Request, Response, NextFunction } from 'express';
import { handleError, sendErrorResponse } from '../utils/responseHelpers';
import logger from '../config/logger';

/**
 * Global error handling middleware
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { message, statusCode } = handleError(err, req);
  sendErrorResponse(res, message, statusCode);
}

/**
 * Handle 404 routes
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const message = `Route ${req.originalUrl} not found`;
  logger.warn('Route not found', {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });
  sendErrorResponse(res, message, 404);
}

/**
 * Request logging middleware
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
  });
  
  next();
}

/**
 * Validate request middleware
 */
export function validateRequest(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Basic validation placeholder - you can integrate with Joi, Yup, or similar
      next();
    } catch (error) {
      sendErrorResponse(res, 'Invalid request data', 400);
    }
  };
}