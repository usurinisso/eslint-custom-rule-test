export class UserNotFoundError extends Error {
  constructor(message = 'User Not Found') {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
