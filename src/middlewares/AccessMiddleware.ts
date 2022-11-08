import { Container, Injectable, InjectionToken } from '@decorators/di';
import { Type } from '@decorators/di/lib/src/types';
import { Middleware } from '@decorators/express';
import * as express from 'express';
import _ = require('lodash');

import UserService from '@/domain/user/User.service';

import { AccessLevel, DomainEntityType } from '@/domain';
import { ServerError } from '@/lib';

export function AccessMiddleware(options: {
  domainEntity: DomainEntityType;
  accessLevel: AccessLevel;
}): Type {
  @Injectable()
  class AccessMiddlewareClass implements Middleware {
    constructor(private userSevice: UserService) {}

    async use(
      request: express.Request,
      response: express.Response,
      next: express.NextFunction
    ): Promise<void> {
      try {
        if (_.isNil(request.user)) {
          throw ServerError.forbidden();
        }

        const user = await this.userSevice.findById(
          { id: request.user.id },
          { accessRights: true }
        );

        const accessRight = user.accessRights.find(
          (ar) =>
            ar.domainEntity === options.domainEntity &&
            ar.accessLevel >= options.accessLevel
        );

        if (_.isNil(accessRight)) {
          throw ServerError.forbidden();
        }

        next();
      } catch (err) {
        next(err);
      }
    }
  }

  Container.provide([
    {
      provide: new InjectionToken('ACCESS_MIDDLEWARE'),
      useClass: AccessMiddlewareClass,
    },
  ]);

  return AccessMiddlewareClass;
}
