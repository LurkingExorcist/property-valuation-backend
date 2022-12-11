import { Injectable } from '@decorators/di';
import {
  Body,
  Controller,
  Delete,
  Get,
  Params,
  Post,
  Put,
  Query,
  Response,
} from '@decorators/express';
import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ = require('lodash');

import { DOMAIN_ENTITY_TYPES, URLS } from '@/constants';

import { AccessRightService, ACCESS_LEVELS } from '@/domain/access-right';

import { ICrudController } from '@/interfaces';
import { DataConverter } from '@/lib';
import { AccessMiddleware, AuthMiddleware } from '@/middlewares';
import { Where } from '@/types';

import { User } from '../models';
import { UserService } from '../services';

@Controller(URLS.USERS, [AuthMiddleware])
@Injectable()
export class UserController implements ICrudController {
  constructor(
    private service: UserService,
    private accessRightService: AccessRightService
  ) {}

  @Get('/:id', [
    AccessMiddleware({
      domainEntity: DOMAIN_ENTITY_TYPES.USER,
      accessLevel: ACCESS_LEVELS.READ,
    }),
  ])
  async findById(
    @Response() res: express.Response,
    @Params('id') id: string
  ): Promise<void> {
    await this.service
      .findById({ id }, { accessRights: true })
      .then((data) => res.json(_.omit(data, 'passwordHash')));
  }

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
      .find(DataConverter.restQueryToORM(query), { accessRights: true })
      .then((data) =>
        res.json({
          ...data,
          content: data.content.map((user) => _.omit(user, 'passwordHash')),
        })
      );
  }

  @Post('/', [
    AccessMiddleware({
      domainEntity: DOMAIN_ENTITY_TYPES.USER,
      accessLevel: ACCESS_LEVELS.WRITE,
    }),
  ])
  async create(
    @Response() res: express.Response,
    @Body()
    data: {
      accessRightsIds: string[];
      username: string;
      email: string;
      phoneNumber: string;
      password: string;
    }
  ): Promise<void> {
    const { content: accessRights } = data.accessRightsIds
      ? await this.accessRightService.find({
          where: data.accessRightsIds.map((id) => ({ id })),
        })
      : { content: [] };

    await this.service
      .create(
        {
          accessRights,
          ..._.omit(data, 'accessRightsIds'),
        },
        { accessRights: true }
      )
      .then((data) => res.json(_.omit(data, 'passwordHash')));
  }

  @Put('/:id', [
    AccessMiddleware({
      domainEntity: DOMAIN_ENTITY_TYPES.USER,
      accessLevel: ACCESS_LEVELS.WRITE,
    }),
  ])
  async update(
    @Response() res: express.Response,
    @Params('id') id: string,
    @Body()
    data: Partial<{
      accessRightsIds: string[];
      username: string;
      email: string;
      phoneNumber: string;
      password: string;
    }>
  ): Promise<void> {
    const { content: accessRights } = data.accessRightsIds
      ? await this.accessRightService.find({
          where: data.accessRightsIds.map((id) => ({ id })),
        })
      : { content: [] };

    await this.service
      .update(
        { id },
        {
          accessRights,
          ..._.omit(data, 'accessRightsIds'),
        },
        { accessRights: true }
      )
      .then((data) => res.json(_.omit(data, 'passwordHash')));
  }

  @Delete('/:id', [
    AccessMiddleware({
      domainEntity: DOMAIN_ENTITY_TYPES.USER,
      accessLevel: ACCESS_LEVELS.WRITE,
    }),
  ])
  async remove(
    @Response() res: express.Response,
    @Params('id') id: string
  ): Promise<void> {
    await this.service.remove({ id });

    res.sendStatus(StatusCodes.OK);
  }

  @Delete('/', [
    AccessMiddleware({
      domainEntity: DOMAIN_ENTITY_TYPES.USER,
      accessLevel: ACCESS_LEVELS.WRITE,
    }),
  ])
  async batchRemove(
    @Response() res: express.Response,
    @Query() query?: Where<User>
  ): Promise<void> {
    await this.service.batchRemove(
      DataConverter.whereToFindOptions(query || {})
    );

    res.sendStatus(StatusCodes.OK);
  }
}
