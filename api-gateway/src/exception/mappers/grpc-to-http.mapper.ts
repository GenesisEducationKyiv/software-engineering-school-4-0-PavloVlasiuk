import { status as Status } from '@grpc/grpc-js';
import { HttpStatus } from '@nestjs/common';

const HttpFromGrcp: Record<number, number> = {
  [Status.UNKNOWN]: HttpStatus.BAD_GATEWAY,
  [Status.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [Status.ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [Status.UNAVAILABLE]: HttpStatus.NOT_FOUND,
};

export const grpcToHttpMapper = (grpcCode: number): number => {
  const httpCode = HttpFromGrcp[grpcCode];

  if (!httpCode) return HttpStatus.INTERNAL_SERVER_ERROR;

  return httpCode;
};
