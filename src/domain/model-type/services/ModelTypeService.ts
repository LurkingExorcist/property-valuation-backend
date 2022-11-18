import { Injectable } from '@decorators/di';
import _ = require('lodash');
import { FindOptionsRelations } from 'typeorm';

import { DOMAIN_ENTITY_TYPES } from '@/constants';

import { AppDataSource } from '@/data-source';
import { ICrudService } from '@/interfaces';
import { ServerError } from '@/lib';
import { FindQuery, PaginatedData, ParameterOf } from '@/types';

import { ModelType } from '../models';

@Injectable()
export class ModelTypeService implements ICrudService<ModelType> {
  async findById(
    query: { id: string },
    relations?: FindOptionsRelations<ModelType>
  ): Promise<ModelType> {
    const entity = await AppDataSource.manager.findOne(ModelType, {
      relations,
      where: { id: query.id },
    });

    if (_.isNull(entity)) {
      throw ServerError.cantFind({ entity: DOMAIN_ENTITY_TYPES.MODEL_TYPE });
    }

    return entity;
  }

  async find(
    query: FindQuery<ModelType> = {},
    relations?: FindOptionsRelations<ModelType>
  ): Promise<PaginatedData<ModelType>> {
    const [content, total] = await AppDataSource.manager.findAndCount(
      ModelType,
      {
        relations,
        ...query,
      }
    );

    return { content, total };
  }

  async create(
    data: ParameterOf<typeof ModelType['new']>,
    relations?: FindOptionsRelations<ModelType>
  ): Promise<ModelType> {
    return AppDataSource.manager
      .save(ModelType.new(data))
      .then((entity) => this.findById({ id: entity.id }, relations));
  }

  async update(
    query: { id: string },
    data: Omit<Partial<ModelType>, 'id'>,
    relations?: FindOptionsRelations<ModelType>
  ): Promise<ModelType> {
    return AppDataSource.manager
      .update(ModelType, query, data)
      .then(() => this.findById({ id: query.id }, relations));
  }

  async remove(query: { id: string }): Promise<void> {
    await AppDataSource.manager.delete(ModelType, query);
  }
}
