import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export class AlreadySubscribedException extends RpcException {
  constructor() {
    super({
      message: 'Email is already subscribed',
      status: HttpStatus.CONFLICT,
    });
  }
}
