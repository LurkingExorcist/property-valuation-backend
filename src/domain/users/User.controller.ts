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

import URLS from '@/lib/app/urls';

import ICrudController from '@/interfaces/ICrudController';

import AccessRightService from '../access-rights/AccessRight.service';

import UserService from './User.service';

@Controller(URLS.USERS)
@Injectable()
export default class UserController implements ICrudController {
  constructor(
    private service: UserService,
    private accessRightService: AccessRightService
  ) {}

  @Get('/:id')
  async findById(
    @Response() res: express.Response,
    @Params('id') id: string
  ): Promise<void> {
    await this.service
      .findById({ id }, { accessRights: true })
      .then((data) => res.json(data));
  }

  @Get('/')
  async find(
    @Response() res: express.Response,
    @Query() query?: Record<string, unknown>
  ): Promise<void> {
    await this.service
      .find(query, { accessRights: true })
      .then((data) => res.json(data));
  }

  @Post('/')
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
    const accessRights = await this.accessRightService.find(
      data.accessRightsIds.map((id) => ({ id }))
    );

    await this.service
      .create(
        {
          accessRights,
          ..._.omit(data, 'accessRightsIds'),
        },
        { accessRights: true }
      )
      .then((data) => res.json(data));
  }

  @Put('/:id')
  async update(
    @Response() res: express.Response,
    @Params('id') id: string,
    @Body()
    data: {
      accessRightsIds: string[];
      username: string;
      email: string;
      phoneNumber: string;
      password: string;
    }
  ): Promise<void> {
    const accessRights = await this.accessRightService.find(
      data.accessRightsIds.map((id) => ({ id }))
    );

    await this.service
      .update(
        { id },
        {
          accessRights,
          ..._.omit(data, 'accessRightsIds'),
        },
        { accessRights: true }
      )
      .then((data) => res.json(data));
  }

  @Delete('/:id')
  async remove(
    @Response() res: express.Response,
    @Params('id') id: string
  ): Promise<void> {
    await this.service.remove({ id });

    res.sendStatus(StatusCodes.OK);
  }
}
