import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

export class UnLoginException {
  message: string;

  constructor(message?) {
    this.message = message;
  }
}

@Catch(UnLoginException)
export class UnloginFilter<T> implements ExceptionFilter {
  catch(exception: UnLoginException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response
      .json({
        code: HttpStatus.UNAUTHORIZED,
        message: 'fail',
        data: exception.message || '用户未登录',
      })
      .end();
  }
}
