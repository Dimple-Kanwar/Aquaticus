import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  code?: number;
  statusCode?: number;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  const statusCode = error.statusCode || error.code || 500;
  
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error : undefined
  });
};

// Custom error class
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}