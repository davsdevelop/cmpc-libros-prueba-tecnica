import { LoggingInterceptor } from '../../../src/common/interceptors/logging.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
  });

  it('debería registrar el log en una petición exitosa', (done) => {
    const mockRequest = { method: 'GET', url: '/books', get: jest.fn().mockReturnValue('Postman') };
    const mockResponse = { statusCode: 200 };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    } as ExecutionContext;

    const mockCallHandler = { handle: () => of('test-data') } as CallHandler;
    
    const loggerSpy = jest.spyOn(interceptor['logger'], 'log').mockImplementation();

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: () => {
        expect(loggerSpy).toHaveBeenCalled();
        expect(loggerSpy.mock.calls[0][0]).toContain('GET /books 200 - Postman');
        done();
      },
    });
  });

  it('debería registrar un error (logger.error) si la petición falla', (done) => {
    const mockRequest = { method: 'POST', url: '/users', get: jest.fn().mockReturnValue('Chrome') };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => ({}),
      }),
    } as ExecutionContext;

    const errorToThrow = { status: 404, message: 'Not Found' };
    const mockCallHandler = { handle: () => throwError(() => errorToThrow) } as CallHandler;
    
    const loggerSpyError = jest.spyOn(interceptor['logger'], 'error').mockImplementation();

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      error: () => {
        expect(loggerSpyError).toHaveBeenCalled();
        expect(loggerSpyError.mock.calls[0][0]).toContain('POST /users 404 - Chrome');
        done();
      },
    });
  });
});