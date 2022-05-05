import { Container, Injectable, InjectionToken } from '@decorators/di';
import { Middleware } from '@decorators/express';
import * as express from 'express';
import _ = require('lodash');

import { Type } from '@decorators/di/lib/src/types';

import ServerError from '@/lib/server-error/ServerError';

import AccessType from '@/domain/access-rights/types/AccessType';
import AppSection from '@/domain/access-rights/types/AppSection';
import UserService from '@/domain/users/User.service';

export default function AccessMiddleware(options: {
  appSection: AppSection;
  accessType: AccessType;
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
            ar.appSection === options.appSection &&
            ar.accessType === options.accessType
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
