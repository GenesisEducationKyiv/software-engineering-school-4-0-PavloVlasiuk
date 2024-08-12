import { BaseResponse } from './base.response';

export class SuccessfulResponse extends BaseResponse {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);

    this.success = true;
  }
}
