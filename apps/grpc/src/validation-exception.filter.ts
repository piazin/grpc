import { status } from '@grpc/grpc-js';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const rpcException = new RpcException({
      message: JSON.stringify(exception.getResponse()),
      code: status.FAILED_PRECONDITION,
    });

    return throwError(() => rpcException.getError());
  }
}
