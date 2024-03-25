class ApiError extends Error {
  public statusCode: number;
  public errors: any[];
  public data: any | null;
  public success: boolean;

  constructor(
    statusCode: number,
    message: string = "Internal server error",
    errors: any[] = [],
    stack?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
