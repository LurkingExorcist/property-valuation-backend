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

import AppSectionService from '@/domain/app-sections/AppSection.service';

import ICrudController from '@/interfaces/ICrudController';

import AccessType from './types/AccessType';
import AccessRightService from './AccessRight.service';

@Controller(URLS.ACCESS_RIGHTS)
@Injectable()
export default class AccessRightController implements ICrudController {
  constructor(
    private service: AccessRightService,
    private appSectionService: AppSectionService
  ) {}

  @Get('/:id')
  async findById(
    @Response() res: express.Response,
    @Params('id') id: string
  ): Promise<void> {
    await this.service
      .findById({ id }, { appSection: true })
      .then((data) => res.json(data));
  }

  @Get('/')
  async find(
    @Response() res: express.Response,
    @Query() query?: Record<string, unknown>
  ): Promise<void> {
    await this.service
      .find(query, { appSection: true })
      .then((data) => res.json(data));
  }

  @Post('/')
  async create(
    @Response() res: express.Response,
    @Body()
    data: {
      appSectionId: string;
      accessType: AccessType;
    }
  ): Promise<void> {
    const appSection = await this.appSectionService.findById({
      id: data.appSectionId,
    });
    await this.service
      .create(
        {
          appSection,
          accessType: data.accessType,
        },
        { appSection: true }
      )
      .then((data) => res.json(data));
  }

  @Put('/:id')
  async update(
    @Response() res: express.Response,
    @Params('id') id: string,
    @Body()
    data: {
      appSectionId: string;
      accessType: AccessType;
    }
  ): Promise<void> {
    const appSection = await this.appSectionService.findById({
      id: data.appSectionId,
    });

    await this.service
      .update(
        { id },
        {
          appSection,
          accessType: data.accessType,
        },
        { appSection: true }
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
