import { Container, Injectable, InjectionToken } from '@decorators/di';
import { Middleware } from '@decorators/express';
import * as express from 'express';
import { StatusCodes } from 'http-status-codes';

import { ServerError } from '@/lib';

@Injectable()
export class NotFoundMiddleware implements Middleware {
  use(request: express.Request, response: express.Response): void {
    response.status(StatusCodes.NOT_FOUND).json(
      ServerError.notFound({
        method: request.method,
        route: request.path,
      })
    );
  }
}

Container.provide([
  {
    provide: new InjectionToken('NOT_FOUND_MIDDLEWARE'),
    useClass: NotFoundMiddleware,
  },
]);
