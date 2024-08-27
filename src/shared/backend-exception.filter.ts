import { ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { BackendException } from './backend.exception';

export class BackendExceptionFilter implements ExceptionFilter {
  catch(exception: any): Response {
    if (!(exception instanceof BackendException)) {
      return;
    }

    console.error(exception.message);
  }
}
