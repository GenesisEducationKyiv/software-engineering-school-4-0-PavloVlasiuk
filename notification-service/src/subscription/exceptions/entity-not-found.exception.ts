import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export class EntityNotFoundException extends RpcException {
  constructor(entity: string) {
    const message = `${entity} is not found`;

    super({
      details: message,
      code: HttpStatus.NOT_FOUND,
    });
  }
}
