import { Container, Injectable } from '@decorators/di';
import { ERROR_MIDDLEWARE, ErrorMiddleware } from '@decorators/express';
import * as express from 'express';

import ServerError from '@/lib/server-error/ServerError';
import _ = require('lodash');
import { QueryFailedError } from 'typeorm';

import { IS_DEBUG_MODE } from '@/config';

@Injectable()
export default class ServerErrorMiddleware implements ErrorMiddleware {
  public use(
    error: unknown,
    request: express.Request,
    response: express.Response,
    next: express.NextFunction // eslint-disable-line
  ) {
    if (IS_DEBUG_MODE) {
      console.error(error);
    }

    const serverError = _.cond<unknown, ServerError>([
      [(err) => err instanceof ServerError, _.identity],
      [
        (err) => err instanceof QueryFailedError,
        (err) =>
          ServerError.badRequest({
            message: (<Error>err).message,
            exception: <Error>err,
          }),
      ],
      [
        (err) => err instanceof Error,
        (err) =>
          ServerError.internalError({
            message: (<Error>err).message,
            exception: <Error>err,
          }),
      ],
      [
        _.stubFalse,
        (err) =>
          ServerError.internalError({
            message: 'Неизвестная ошибка',
            exception: new Error(_.toString(err)),
          }),
      ],
    ])(error);

    response.status(serverError.status).json(serverError);
  }
}

Container.provide([
  { provide: ERROR_MIDDLEWARE, useClass: ServerErrorMiddleware },
]);
