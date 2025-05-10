export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public status: number
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super('VALIDATION_ERROR', message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super('NOT_FOUND', message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super('UNAUTHORIZED', message, 401);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string) {
    super('RATE_LIMIT', message, 429);
  }
}
