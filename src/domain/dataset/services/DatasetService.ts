import { Injectable } from '@decorators/di';
import _ = require('lodash');
import { FindOptionsRelations } from 'typeorm';

import { DOMAIN_ENTITY_TYPES } from '@/constants';

import { AppDataSource } from '@/data-source';
import { ICrudService } from '@/interfaces';
import { ServerError } from '@/lib';
import { FindQuery, PaginatedData, ParameterOf } from '@/types';

import { Dataset } from '../models';

@Injectable()
export class DatasetService implements ICrudService<Dataset> {
  async findById(
    query: { id: string },
    relations?: FindOptionsRelations<Dataset>
  ): Promise<Dataset> {
    const entity = await AppDataSource.manager.findOne(Dataset, {
      relations,
      where: { id: query.id },
    });

    if (_.isNull(entity)) {
      throw ServerError.cantFind({ entity: DOMAIN_ENTITY_TYPES.DATASET });
    }

    return entity;
  }

  async find(
    query: FindQuery<Dataset> = {},
    relations?: FindOptionsRelations<Dataset>
  ): Promise<PaginatedData<Dataset>> {
    const [content, total] = await AppDataSource.manager.findAndCount(Dataset, {
      relations,
      ...query,
    });

    return { content, total };
  }

  async create(
    data: ParameterOf<typeof Dataset['new']>,
    relations?: FindOptionsRelations<Dataset>
  ): Promise<Dataset> {
    return AppDataSource.manager
      .save(Dataset.new(data))
      .then((entity) => this.findById({ id: entity.id }, relations));
  }

  async update(
    query: { id: string },
    data: Omit<Partial<Dataset>, 'id'>,
    relations?: FindOptionsRelations<Dataset>
  ): Promise<Dataset> {
    return AppDataSource.manager
      .update(Dataset, query, data)
      .then(() => this.findById({ id: query.id }, relations));
  }

  async remove(query: { id: string }): Promise<void> {
    await AppDataSource.manager.delete(Dataset, query);
  }
}
