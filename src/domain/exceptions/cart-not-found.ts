export class CartNotFoundError extends Error {
  constructor(message = 'Cart Not Found') {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
