export class UserInUseError extends Error {
  constructor(message = 'User With This User Name Already Taken') {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
