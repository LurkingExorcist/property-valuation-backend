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
import {
  Apartment,
  ApartmentService,
  DATASET_TABLE_COLUMNS,
} from '@/domain/apartment';

import { ICrudController } from '@/interfaces';
import { CsvIO, DataConverter } from '@/lib';
import { AccessMiddleware, AuthMiddleware } from '@/middlewares';
import { Where } from '@/types';

import { DATASET_DIR } from '../constants';
import { DatasetService } from '../services';

@Controller(URLS.DATASETS, [AuthMiddleware])
@Injectable()
export class DatasetController implements ICrudController {
  constructor(
    private service: DatasetService,
    private apartmentService: ApartmentService
  ) {}

  @Get('/:id', [
    AccessMiddleware({
      domainEntity: DOMAIN_ENTITY_TYPES.DATASET,
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
      domainEntity: DOMAIN_ENTITY_TYPES.DATASET,
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
      domainEntity: DOMAIN_ENTITY_TYPES.DATASET,
      accessLevel: ACCESS_LEVELS.WRITE,
    }),
  ])
  async create(
    @Response() res: express.Response,
    @Body()
    data: {
      name: string;
      description: string;
      datasetQuery: Where<Apartment>;
      splitRatio?: number;
    }
  ): Promise<void> {
    const apartments = await this.apartmentService
      .find(DataConverter.restQueryToORM({ where: data.datasetQuery }), {
        city: true,
        viewsInWindow: true,
      })
      .then((data) =>
        data.content.map((apartment, index) =>
          apartment.toDatasetObject({ index })
        )
      );

    if (_.isNil(data.splitRatio)) {
      await this.service
        .create({
          name: data.name,
          description: data.description,
          datasetQuery: data.datasetQuery,
        })
        .then((data) => {
          CsvIO.write({
            filePath: [DATASET_DIR, data.id, '.csv'].join(''),
            data: apartments,
            columns: Array.from(DATASET_TABLE_COLUMNS),
          });

          res.json(data);
        });
    } else {
      const [train, test] = _.chunk(
        apartments,
        data.splitRatio * apartments.length
      );

      await Promise.all(
        Object.entries({ train, test }).map(([datasetType, dataset]) =>
          this.service
            .create({
              name: [data.name, datasetType].join('.'),
              description: data.description,
              datasetQuery: data.datasetQuery,
            })
            .then((data) => {
              CsvIO.write({
                filePath: [DATASET_DIR, data.id, '.csv'].join(''),
                data: dataset,
                columns: Array.from(DATASET_TABLE_COLUMNS),
              });

              return data;
            })
        )
      ).then((datasets) => res.json(datasets));
    }
  }

  @Put('/:id', [
    AccessMiddleware({
      domainEntity: DOMAIN_ENTITY_TYPES.DATASET,
      accessLevel: ACCESS_LEVELS.WRITE,
    }),
  ])
  async update(
    @Response() res: express.Response,
    @Params('id') id: string,
    @Body()
    data: {
      description: string;
    }
  ): Promise<void> {
    await this.service
      .update(
        { id },
        {
          description: data.description,
        }
      )
      .then((data) => res.json(data));
  }

  @Delete('/:id', [
    AccessMiddleware({
      domainEntity: DOMAIN_ENTITY_TYPES.DATASET,
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
