export class BadLoginError extends Error {
  constructor(message = 'Username or password incorrect') {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
