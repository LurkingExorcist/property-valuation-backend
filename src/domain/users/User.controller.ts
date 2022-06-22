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

import { URLS } from '@/config';

import AccessRightService from '@/domain/access-rights/AccessRight.service';
import AccessType from '@/domain/access-rights/types/AccessType';
import AppSection from '@/domain/access-rights/types/AppSection';

import { restQueryToORM } from '@/lib/utils';

import AccessMiddleware from '@/middlewares/AccessMiddleware';
import AuthMiddleware from '@/middlewares/AuthMiddleware';

import ICrudController from '@/interfaces/ICrudController';

import UserService from './User.service';

@Controller(URLS.USERS, [AuthMiddleware])
@Injectable()
export default class UserController implements ICrudController {
  constructor(
    private service: UserService,
    private accessRightService: AccessRightService
  ) {}

  @Get('/:id', [
    AccessMiddleware({
      appSection: AppSection.USERS,
      accessType: AccessType.READ,
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
      appSection: AppSection.USERS,
      accessType: AccessType.READ,
    }),
  ])
  async find(
    @Response() res: express.Response,
    @Query() query?: Record<string, unknown>
  ): Promise<void> {
    await this.service
      .find(restQueryToORM(query), { accessRights: true })
      .then((data) =>
        res.json({
          ...data,
          content: data.content.map((user) => _.omit(user, 'passwordHash')),
        })
      );
  }

  @Post('/', [
    AccessMiddleware({
      appSection: AppSection.USERS,
      accessType: AccessType.WRITE,
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
      appSection: AppSection.USERS,
      accessType: AccessType.WRITE,
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
      appSection: AppSection.USERS,
      accessType: AccessType.WRITE,
    }),
  ])
  async remove(
    @Response() res: express.Response,
    @Params('id') id: string
  ): Promise<void> {
    await this.service.remove({ id });

    res.sendStatus(StatusCodes.OK);
  }
}
