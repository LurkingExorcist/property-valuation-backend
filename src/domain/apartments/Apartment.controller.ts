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

import CityService from '../cities/City.service';
import ViewInWindowService from '../views-in-window/ViewInWindow.service';

import ApartmentService from './Apartment.service';
import _ = require('lodash');

@Controller(URLS.APARTMENTS)
@Injectable()
export default class ApartmentController implements ICrudController {
  constructor(
    private service: ApartmentService,
    private cityService: CityService,
    private viewInWindowService: ViewInWindowService
  ) {}

  @Get('/:id')
  async findById(
    @Response() res: express.Response,
    @Params('id') id: string
  ): Promise<void> {
    await this.service
      .findById({ id }, { city: true, viewsInWindow: true })
      .then((data) => res.json(data));
  }

  @Get('/')
  async find(
    @Response() res: express.Response,
    @Query() query?: Record<string, unknown>
  ): Promise<void> {
    await this.service
      .find(query, { city: true, viewsInWindow: true })
      .then((data) => res.json(data));
  }

  @Post('/')
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
    const viewsInWindow = await this.viewInWindowService.find(
      data.viewsInWindowIds.map((id) => ({ id }))
    );

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

  @Put('/:id')
  async update(
    @Response() res: express.Response,
    @Params('id') id: string,
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
    const viewsInWindow = await this.viewInWindowService.find(
      data.viewsInWindowIds.map((id) => ({ id }))
    );

    await this.service
      .update(
        { id },
        {
          city,
          viewsInWindow,
          ..._.omit(data, 'cityId', 'viewsInWindowIds'),
        },
        { city: true, viewsInWindow: true }
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
