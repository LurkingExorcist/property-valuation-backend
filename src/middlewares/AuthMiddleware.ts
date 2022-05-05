import { Container, Injectable, InjectionToken } from '@decorators/di';
import { Middleware } from '@decorators/express';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import _ = require('lodash');

import User from '@/domain/users/User.model';

import ServerError from '@/lib/server-error/ServerError';

@Injectable()
export default class AuthMiddleware implements Middleware {
  use(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): void {
    try {
      const bearerToken = request.headers.authorization;

      if (_.isNil(bearerToken) || _.isArray(bearerToken)) {
        throw ServerError.forbidden();
      }

      const { groups } = bearerToken.match(/Bearer (?<token>.+)/) || {};
      const user = jwt.verify(groups?.token || '', process.env.JWT_SECRET);

      if (_.isObject(user)) {
        request.user = user as User;
        next();
      } else {
        throw ServerError.internalError({
          message: 'Во время расшифровки токена произошла ошибка',
        });
      }
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        if (err instanceof jwt.TokenExpiredError) {
          return next(ServerError.tokenExpired());
        }

        return next(ServerError.forbidden());
      }

      next(err);
    }
  }
}

Container.provide([
  { provide: new InjectionToken('AUTH_MIDDLEWARE'), useClass: AuthMiddleware },
]);
