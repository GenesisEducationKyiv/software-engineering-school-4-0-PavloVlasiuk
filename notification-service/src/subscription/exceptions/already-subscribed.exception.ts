import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export class AlreadySubscribedException extends RpcException {
  constructor() {
    const message = 'Email is already subscribed';

    super({
      details: message,
      code: HttpStatus.CONFLICT,
    });
  }
}
