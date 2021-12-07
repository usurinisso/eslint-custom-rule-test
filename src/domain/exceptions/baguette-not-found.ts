export class BaguetteNotFoundError extends Error {
  constructor(message = 'Baguette Not Found') {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
