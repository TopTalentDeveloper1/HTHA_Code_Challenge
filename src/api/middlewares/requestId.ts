import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Adds a unique request ID to each request for tracing
 * This helps with debugging and log correlation
 */
export const requestId = (req: Request, res: Response, next: NextFunction) => {
  // Generate or use existing request ID
  const id = (req.headers['x-request-id'] as string) || uuidv4();
  
  // Attach to request object
  (req as any).id = id;
  
  // Add to response headers
  res.setHeader('X-Request-ID', id);
  
  next();
};

// Extend Express Request type to include id
declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}
