import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/app-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = req.id || 'unknown';
  const timestamp = new Date().toISOString();

  if (err instanceof AppError) {
    const response: any = {
      status: 'error',
      message: err.message,
      requestId,
      timestamp
    };

    // Include validation details if available
    if (err instanceof Error && 'details' in err) {
      response.details = (err as any).details;
    }

    // Include stack trace in development
    if (err.isOperational && process.env.NODE_ENV === 'development') {
      response.stack = err.stack;
    }

    return res.status(err.statusCode).json(response);
  }

  // Unknown error - log for debugging but don't expose details to client
  console.error('Unexpected error:', {
    requestId,
    timestamp,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    requestId,
    timestamp
  });
};
