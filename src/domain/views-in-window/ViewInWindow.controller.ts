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
import AccessMiddleware from '@/middlewares/AccessMiddleware';
import AuthMiddleware from '@/middlewares/AuthMiddleware';

import AccessType from '../access-rights/types/AccessType';
import AppSection from '../access-rights/types/AppSection';

import ViewInWindowService from './ViewInWindow.service';

@Controller(URLS.CITIES, [AuthMiddleware])
@Injectable()
export default class ViewInWindowController implements ICrudController {
  constructor(private service: ViewInWindowService) {}

  @Get('/:id', [
    AccessMiddleware({
      appSection: AppSection.VIEWS_IN_WINDOW,
      accessType: AccessType.READ,
    }),
  ])
  async findById(
    @Response() res: express.Response,
    @Params('id') id: string
  ): Promise<void> {
    await this.service.findById({ id }).then((data) => res.json(data));
  }

  @Get('/', [
    AccessMiddleware({
      appSection: AppSection.VIEWS_IN_WINDOW,
      accessType: AccessType.READ,
    }),
  ])
  async find(
    @Response() res: express.Response,
    @Query() query?: Record<string, unknown>
  ): Promise<void> {
    await this.service.find(query).then((data) => res.json(data));
  }

  @Post('/', [
    AccessMiddleware({
      appSection: AppSection.VIEWS_IN_WINDOW,
      accessType: AccessType.WRITE,
    }),
  ])
  async create(
    @Response() res: express.Response,
    @Body()
    data: {
      name: string;
      description?: string;
    }
  ): Promise<void> {
    await this.service
      .create({
        name: data.name,
        description: data.description,
      })
      .then((data) => res.json(data));
  }

  @Put('/:id', [
    AccessMiddleware({
      appSection: AppSection.VIEWS_IN_WINDOW,
      accessType: AccessType.WRITE,
    }),
  ])
  async update(
    @Response() res: express.Response,
    @Params('id') id: string,
    @Body()
    data: {
      name: string;
      description?: string;
    }
  ): Promise<void> {
    await this.service
      .update(
        { id },
        {
          name: data.name,
          description: data.description,
        }
      )
      .then((data) => res.json(data));
  }

  @Delete('/:id', [
    AccessMiddleware({
      appSection: AppSection.VIEWS_IN_WINDOW,
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
