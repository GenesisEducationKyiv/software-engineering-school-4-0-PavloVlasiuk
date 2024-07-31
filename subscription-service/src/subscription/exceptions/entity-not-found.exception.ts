import { status as Status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

export class EntityNotFoundException extends RpcException {
  constructor(name: string) {
    const message = `${name} is not found`;

    super({
      details: message,
      code: Status.NOT_FOUND,
    });
  }
}
