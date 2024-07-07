import { status as Status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

export class RateClientException extends RpcException {
  constructor() {
    const message =
      'Error fetching exchange rate data from third party service';

    super({ details: message, code: Status.INTERNAL });
  }
}
