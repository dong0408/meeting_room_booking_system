import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  private readonly logger = new Logger(InvokeRecordInterceptor.name);
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const userAgent = request.headers['user-agent'];

    const { ip, method, path } = request;

    this.logger.debug(
      `${method} ${path} ${response.statusCode} ${userAgent} ${ip}:${context.getClass().name} ${context.getHandler().name}invoked...`,
    );
    this.logger.debug(
      `user: ${request.user?.username}, ${request.user?.userId}`,
    );
    const now = Date.now();

    return next.handle().pipe(
      tap((res) => {
        this.logger.debug(
          `${method} ${path} ${ip} ${userAgent}: ${response.statusCode}: ${Date.now() - now}ms`,
        ),
          this.logger.debug(`response: ${JSON.stringify(res)}`);
      }),
    );
  }
}
