import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map(data => {

        const message = data?.message || 'Operación exitosa';
        
        let responseData = data;


        if (data && typeof data === 'object' && 'message' in data) {
          const { message: _, ...rest } = data;
          responseData = Object.keys(rest).length > 0 ? rest : undefined;
        }

        return {
          statusCode: response.statusCode,
          message,
          data: responseData,
        };
      }),
    );
  }
}