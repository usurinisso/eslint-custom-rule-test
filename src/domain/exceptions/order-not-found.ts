export class OrderNotFoundError extends Error {
  constructor(message = 'Order Not Found') {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
