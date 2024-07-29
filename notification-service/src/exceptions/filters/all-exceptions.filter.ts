import { Catch, HttpStatus, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, of } from 'rxjs';

import { UnsuccessfulResponse } from '../../common/responses';
import { IResponse } from '../../common/responses/interfaces';
import { IRpcExceptionData } from '../interfaces';

@Catch()
export class AllExceptionsFilter implements RpcExceptionFilter {
  catch(exception: any): Observable<IResponse> {
    console.log(exception);

    if (exception instanceof RpcException) {
      const error = exception.getError() as IRpcExceptionData;

      return of(new UnsuccessfulResponse(error.details, error.code));
    }

    const message: string = exception.message
      ? exception.message
      : 'Internal server error';

    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    return of(new UnsuccessfulResponse(message, statusCode));
  }
}