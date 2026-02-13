import { AppError } from './app-error';

export class DatabaseError extends AppError {
  constructor(message: string, public originalError?: any) {
    super(message, 500, true);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}
