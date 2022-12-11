import { Injectable } from '@decorators/di';
import { Controller, Get, Params, Query, Response } from '@decorators/express';
import * as express from 'express';

import { DOMAIN_ENTITY_TYPES, URLS } from '@/constants';

import { ACCESS_LEVELS } from '@/domain/access-right';

import { DataConverter } from '@/lib';
import { AccessMiddleware, AuthMiddleware } from '@/middlewares';

import { AccessRightService } from '../services';

@Controller(URLS.ACCESS_RIGHTS, [AuthMiddleware])
@Injectable()
export class AccessRightController {
  constructor(private service: AccessRightService) {}

  @Get('/', [
    AccessMiddleware({
      domainEntity: DOMAIN_ENTITY_TYPES.USER,
      accessLevel: ACCESS_LEVELS.READ,
    }),
  ])
  async find(
    @Response() res: express.Response,
    @Query() query?: Record<string, unknown>
  ): Promise<void> {
    await this.service
      .find(DataConverter.restQueryToORM(query))
      .then((data) => res.json(data));
  }
}
