import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const { method, url } = request;
    const userAgent = request.get('user-agent') || '';
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = ctx.getResponse();
          const { statusCode } = response;
          this.logger.log(`${method} ${url} ${statusCode} - ${userAgent} - ${Date.now() - now}ms`);
        },
        error: (err) => {
          const statusCode = err.status || 500;
          this.logger.error(`${method} ${url} ${statusCode} - ${userAgent} - ${Date.now() - now}ms - Error: ${err.message}`);
        }
      }),
    );
  }
}