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

import { ACCESS_LEVELS } from '@/domain/access-right';
import { CityService } from '@/domain/city';
import { ViewInWindowService } from '@/domain/view-in-window';

import { ICrudController } from '@/interfaces';
import { DataConverter } from '@/lib';
import { AccessMiddleware, AuthMiddleware } from '@/middlewares';
import { RestFindQuery } from '@/types';

import { Apartment } from '../models';
import { ApartmentService } from '../services';

@Controller(URLS.APARTMENTS, [AuthMiddleware])
@Injectable()
export class ApartmentController implements ICrudController {
  constructor(
    private service: ApartmentService,
    private cityService: CityService,
    private viewInWindowService: ViewInWindowService
  ) {}

  @Get('/:id', [
    AccessMiddleware({
      domainEntity: DOMAIN_ENTITY_TYPES.APARTMENT,
      accessLevel: ACCESS_LEVELS.READ,
    }),
  ])
  async findById(
    @Response() res: express.Response,
    @Params('id') id: string
  ): Promise<void> {
    await this.service
      .findById({ id }, { city: true, viewsInWindow: true })
      .then((data) => res.json(data));
  }

  @Get('/', [
    AccessMiddleware({
      domainEntity: DOMAIN_ENTITY_TYPES.APARTMENT,
      accessLevel: ACCESS_LEVELS.READ,
    }),
  ])
  async find(
    @Response() res: express.Response,
    @Query() query?: RestFindQuery<Apartment>
  ): Promise<void> {
    await this.service
      .find(DataConverter.restQueryToORM(query), {
        city: true,
        viewsInWindow: true,
      })
      .then((data) => res.json(data));
  }

  @Post('/', [
    AccessMiddleware({
      domainEntity: DOMAIN_ENTITY_TYPES.APARTMENT,
      accessLevel: ACCESS_LEVELS.WRITE,
    }),
  ])
  async create(
    @Response() res: express.Response,
    @Body()
    data: {
      cityId: string;
      viewsInWindowIds: string[];
      floor: number;
      totalArea: number;
      livingArea: number;
      kitchenArea: number;
      roomCount: number;
      height: number;
      isStudio: boolean;
      totalPrice: number;
    }
  ): Promise<void> {
    const city = await this.cityService.findById({ id: data.cityId });
    const { content: viewsInWindow } = await this.viewInWindowService.find({
      where: data.viewsInWindowIds.map((id) => ({ id })),
    });

    await this.service
      .create(
        {
          city,
          viewsInWindow,
          ..._.omit(data, 'cityId', 'viewsInWindowIds'),
        },
        { city: true, viewsInWindow: true }
      )
      .then((data) => res.json(data));
  }

  @Put('/:id', [
    AccessMiddleware({
      domainEntity: DOMAIN_ENTITY_TYPES.APARTMENT,
      accessLevel: ACCESS_LEVELS.WRITE,
    }),
  ])
  async update(
    @Response() res: express.Response,
    @Params('id') id: string,
    @Body()
    data: Partial<{
      cityId: string;
      viewsInWindowIds: string[];
      floor: number;
      totalArea: number;
      livingArea: number;
      kitchenArea: number;
      roomCount: number;
      height: number;
      isStudio: boolean;
      totalPrice: number;
    }>
  ): Promise<void> {
    const city = data.cityId
      ? await this.cityService.findById({ id: data.cityId })
      : undefined;
    const viewsInWindow = data.viewsInWindowIds
      ? await this.viewInWindowService.find({
          where: data.viewsInWindowIds.map((id) => ({ id })),
        })
      : undefined;

    await this.service
      .update(
        { id },
        _.omitBy(
          {
            city,
            viewsInWindow,
            ..._.omit(data, 'cityId', 'viewsInWindowIds'),
          },
          _.isNil
        ),
        { city: true, viewsInWindow: true }
      )
      .then((data) => res.json(data));
  }

  @Delete('/:id', [
    AccessMiddleware({
      domainEntity: DOMAIN_ENTITY_TYPES.APARTMENT,
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
