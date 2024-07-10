class ApiError extends Error {
  statusCode: number;
  errorType: string | undefined;
  success: boolean;
  errors: string[];

  constructor(
    statusCode: number,
    errorMessage: string = "Something went wrong",
    errorType?: string,
    errors: string[] = []
  ) {
    super(errorMessage);
    this.statusCode = statusCode;
    this.errorMessage = errorMessage;
    this.errorType = errorType;
    this.success = false;
    this.errors = errors;

    // Set the prototype explicitly for built-in classes like Error
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  errorMessage: string;
}

export { ApiError };
