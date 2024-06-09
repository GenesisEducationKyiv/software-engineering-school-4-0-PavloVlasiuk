import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadySubscribedException extends HttpException {
  constructor() {
    super('Email is already subscribed', HttpStatus.CONFLICT);
  }
}
