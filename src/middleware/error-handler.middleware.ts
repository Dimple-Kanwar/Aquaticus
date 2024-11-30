import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  console.error(err);

  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message
  });
}