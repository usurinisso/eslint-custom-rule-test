export class ShopNotFoundError extends Error {
  constructor(message = 'Shop Not Found') {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
