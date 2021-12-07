export type AppErrorCode = string | number;

export class AppError extends Error {
  readonly code?: AppErrorCode;

  constructor(params?: AppErrorParams) {
    super(params?.message);

    this.code = params?.code;
  }
}

export interface AppErrorParams {
  readonly code?: AppErrorCode;

  readonly message?: string;
}
