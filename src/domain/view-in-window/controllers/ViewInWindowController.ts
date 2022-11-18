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

import { DOMAIN_ENTITY_TYPES, URLS } from '@/constants';

import { ACCESS_LEVELS } from '@/domain/access-right';

import { ICrudController } from '@/interfaces';
import { DataConverter } from '@/lib';
import { AccessMiddleware, AuthMiddleware } from '@/middlewares';

import { ViewInWindowService } from '../services';

@Controller(URLS.VIEWS_IN_WINDOW, [AuthMiddleware])
@Injectable()
export class ViewInWindowController implements ICrudController {
  constructor(private service: ViewInWindowService) {}

  @Get('/:id', [
    AccessMiddleware({
      domainEntity: DOMAIN_ENTITY_TYPES.VIEW_IN_WINDOW,
      accessLevel: ACCESS_LEVELS.READ,
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
      domainEntity: DOMAIN_ENTITY_TYPES.VIEW_IN_WINDOW,
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

  @Post('/', [
    AccessMiddleware({
      domainEntity: DOMAIN_ENTITY_TYPES.VIEW_IN_WINDOW,
      accessLevel: ACCESS_LEVELS.WRITE,
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
      domainEntity: DOMAIN_ENTITY_TYPES.VIEW_IN_WINDOW,
      accessLevel: ACCESS_LEVELS.WRITE,
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
      domainEntity: DOMAIN_ENTITY_TYPES.VIEW_IN_WINDOW,
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
}
