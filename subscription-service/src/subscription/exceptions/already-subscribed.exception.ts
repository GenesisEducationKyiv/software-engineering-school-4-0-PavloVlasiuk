import { status as Status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { status as Status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

export class AlreadySubscribedException extends RpcException {
  constructor() {
    const message = 'Email is already subscribed';

    super({
      details: message,
      code: Status.ALREADY_EXISTS,
    });
  }
}
