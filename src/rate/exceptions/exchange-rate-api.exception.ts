import { HttpException, HttpStatus } from '@nestjs/common';

export class ExchangeRateAPIException extends HttpException {
  constructor() {
    super(
      'Error fetching exchange rate data from third party service',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
