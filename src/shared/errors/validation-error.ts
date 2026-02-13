import { AppError } from './app-error';

export class ValidationError extends AppError {
  constructor(message: string, public details?: any) {
    super(message, 400, true);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
