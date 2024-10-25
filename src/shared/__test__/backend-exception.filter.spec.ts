import { BackendExceptionFilter } from '../backend-exception.filter';
import { BackendException } from '../backend.exception';
import { Response } from 'express';
import { ArgumentsHost, HttpException } from '@nestjs/common';

describe('BackendExceptionFilter', () => {
  let filter: BackendExceptionFilter;
  let response: Response;
  let host: ArgumentsHost;
  let consoleErrorSpy: any;

  beforeEach(() => {
    filter = new BackendExceptionFilter();
    // Mock the Express response object
    response = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response; // Type assertion to express Response

    host = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(response),
      }),
    } as unknown as ArgumentsHost; // Type assertion to ArgumentsHost
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should log the message of BackendException', () => {
    const exception = new BackendException('Test error message', 400);

    filter.catch(exception);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Test error message');
  });

  it('should not log for non-BackendException', () => {
    const exception = new HttpException('This is not a BackendException', 400);

    filter.catch(exception as any);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
