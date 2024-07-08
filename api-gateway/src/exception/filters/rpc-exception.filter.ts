import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

import { IHttpError, IRpcError } from '../interfaces';
import { grpcToHttpMapper } from '../mappers';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const error = exception.getError() as IRpcError;

    const response = host.switchToHttp().getResponse<Response>();

    const httpCode = grpcToHttpMapper(error.code);

    const httpError: IHttpError = {
      message: error.details,
      statusCode: httpCode,
    };

    response.status(httpCode).json(httpError);
  }
}
