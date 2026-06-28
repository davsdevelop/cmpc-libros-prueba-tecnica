import { TransformInterceptor } from '../../../src/common/interceptors/transform.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>;

  beforeEach(() => {
    interceptor = new TransformInterceptor();
  });

  it('debería envolver la respuesta en el formato estándar con message y data', (done) => {
    const mockContext = {
      switchToHttp: () => ({
        getResponse: () => ({ statusCode: 200 }),
      }),
    } as ExecutionContext;

    const mockCallHandler = {
      handle: () => of({ message: 'Libro creado', id: 1, title: 'Test' }),
    } as CallHandler;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: (result) => {
        expect(result.statusCode).toBe(200);
        expect(result.message).toBe('Libro creado');
        expect(result.data).toEqual({ id: 1, title: 'Test' });
        done();
      },
    });
  });

  it('debería asignar un mensaje por defecto si el servicio no envía uno', (done) => {
    const mockContext = {
      switchToHttp: () => ({ getResponse: () => ({ statusCode: 200 }) }),
    } as ExecutionContext;

    const mockCallHandler = { handle: () => of({ id: 1 }) } as CallHandler;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: (result) => {
        expect(result.message).toBe('Operación exitosa');
        expect(result.data).toEqual({ id: 1 });
        done();
      },
    });
  });
});