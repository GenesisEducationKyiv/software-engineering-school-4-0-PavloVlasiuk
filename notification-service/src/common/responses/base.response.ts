import { IResponse } from './interfaces';

export class BaseResponse implements IResponse {
  message: string;
  statusCode: number;
  success: boolean;

  constructor(message: string, statusCode: number) {
    this.message = message;

    this.statusCode = statusCode;
  }
}
