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

import URLS from '@/lib/app/urls';

import ICrudController from '@/interfaces/ICrudController';

import AccessType from './types/AccessType';
import AppSection from './types/AppSection';
import AccessRightService from './AccessRight.service';

@Controller(URLS.ACCESS_RIGHTS)
@Injectable()
export default class AccessRightController implements ICrudController {
  constructor(private service: AccessRightService) {}

  @Get('/:id')
  async findById(
    @Response() res: express.Response,
    @Params('id') id: string
  ): Promise<void> {
    await this.service.findById({ id }).then((data) => res.json(data));
  }

  @Get('/')
  async find(
    @Response() res: express.Response,
    @Query() query?: Record<string, unknown>
  ): Promise<void> {
    await this.service.find(query).then((data) => res.json(data));
  }

  @Post('/')
  async create(
    @Response() res: express.Response,
    @Body()
    data: {
      appSection: AppSection;
      accessType: AccessType;
    }
  ): Promise<void> {
    await this.service
      .create({
        appSection: data.appSection,
        accessType: data.accessType,
      })
      .then((data) => res.json(data));
  }

  @Put('/:id')
  async update(
    @Response() res: express.Response,
    @Params('id') id: string,
    @Body()
    data: {
      appSection: AppSection;
      accessType: AccessType;
    }
  ): Promise<void> {
    await this.service
      .update(
        { id },
        {
          appSection: data.appSection,
          accessType: data.accessType,
        }
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
