import { HttpException, HttpStatus } from '@nestjs/common';

export class BackendException extends HttpException {
  constructor(message: string, httpStatus: HttpStatus) {
    super(message, httpStatus);
  }
}
