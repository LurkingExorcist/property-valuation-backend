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
import { Apartment } from '@/domain/apartment';
import { DatasetService } from '@/domain/dataset';
import { ModelTypeService } from '@/domain/model-type';

import { ICrudController } from '@/interfaces';
import { DataConverter, DataScienceAPI } from '@/lib';
import { AccessMiddleware, AuthMiddleware } from '@/middlewares';
import { Where } from '@/types';

import { MathModelService } from '../services';

@Controller(URLS.MATH_MODELS, [AuthMiddleware])
@Injectable()
export class MathModelController implements ICrudController {
  constructor(
    private service: MathModelService,
    private modelTypeService: ModelTypeService,
    private datasetService: DatasetService
  ) {}

  @Get('/:id', [
    AccessMiddleware({
      domainEntity: DOMAIN_ENTITY_TYPES.MATH_MODEL,
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
      domainEntity: DOMAIN_ENTITY_TYPES.MATH_MODEL,
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
      domainEntity: DOMAIN_ENTITY_TYPES.MATH_MODEL,
      accessLevel: ACCESS_LEVELS.WRITE,
    }),
  ])
  async create(
    @Response() res: express.Response,
    @Body()
    data: {
      name: string;
      datasetPath: string;
      modelTypeId: string;
      formula: string;
    }
  ): Promise<void> {
    const modelType = await this.modelTypeService.findById({
      id: data.modelTypeId,
    });

    await this.service
      .create({
        name: data.name,
        datasetPath: data.datasetPath,
        formula: data.formula,
        modelType,
      })
      .then((data) => res.json(data));
  }

  @Put('/:id', [
    AccessMiddleware({
      domainEntity: DOMAIN_ENTITY_TYPES.MATH_MODEL,
      accessLevel: ACCESS_LEVELS.WRITE,
    }),
  ])
  async update(
    @Response() res: express.Response,
    @Params('id') id: string,
    @Body()
    data: {
      name: string;
      modelTypeId: string;
      formula: string;
    }
  ): Promise<void> {
    const modelType = await this.modelTypeService.findById({
      id: data.modelTypeId,
    });

    await this.service
      .update(
        { id },
        {
          name: data.name,
          formula: data.formula,
          modelType,
        }
      )
      .then((data) => res.json(data));
  }

  @Delete('/:id', [
    AccessMiddleware({
      domainEntity: DOMAIN_ENTITY_TYPES.MATH_MODEL,
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

  @Post('/train/:id', [
    AccessMiddleware({
      domainEntity: DOMAIN_ENTITY_TYPES.MATH_MODEL,
      accessLevel: ACCESS_LEVELS.WRITE,
    }),
  ])
  async train(
    @Response() res: express.Response,
    @Params('id') id: string,
    @Body()
    data: {
      datasetId: string;
    }
  ): Promise<void> {
    const mathModel = await this.service.findById({ id });

    const trainDataset = await this.datasetService.findById({
      id: data.datasetId,
    });

    const { summary, output } = await DataScienceAPI.train({
      name: mathModel.name,
      datasetName: data.datasetId,
      modelType: mathModel.modelType.name,
      formula: mathModel.formula,
    });

    await this.service.update(
      { id },
      {
        trainDataset,
        trainSummary: summary,
        trainedDate: new Date(),
      }
    );

    res.json({
      mathModel,
      output,
    });
  }

  @Post('/predict/:id', [
    AccessMiddleware({
      domainEntity: DOMAIN_ENTITY_TYPES.MATH_MODEL,
      accessLevel: ACCESS_LEVELS.WRITE,
    }),
  ])
  async predict(
    @Response() res: express.Response,
    @Params('id') id: string,
    @Body()
    data: {
      datasetId: string;
    }
  ): Promise<void> {
    const mathModel = await this.service.findById({ id });

    const predictedData = await DataScienceAPI.predict({
      name: mathModel.name,
      datasetName: data.datasetId,
    });

    res.json(predictedData);
  }
}
