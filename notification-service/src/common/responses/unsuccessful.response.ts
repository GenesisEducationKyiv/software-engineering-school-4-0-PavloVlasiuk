import { BaseResponse } from './base.response';

export class UnsuccessfulResponse extends BaseResponse {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);

    this.success = false;
  }
}
