import { Injectable } from '@decorators/di';
import _ = require('lodash');
import { FindOptionsRelations } from 'typeorm';

import { DOMAIN_ENTITY_TYPES } from '@/constants';

import { Apartment } from '@/domain/apartment';

import { AppDataSource } from '@/data-source';
import { ICrudService } from '@/interfaces';
import { ServerError } from '@/lib';
import { FindQuery, PaginatedData, ParameterOf } from '@/types';

import { MathModel } from '../models';

@Injectable()
export class MathModelService implements ICrudService<MathModel> {
  async findById(
    query: { id: string },
    relations?: FindOptionsRelations<MathModel>
  ): Promise<MathModel> {
    const entity = await AppDataSource.manager.findOne(MathModel, {
      relations,
      where: { id: query.id },
    });

    if (_.isNull(entity)) {
      throw ServerError.cantFind({ entity: DOMAIN_ENTITY_TYPES.MATH_MODEL });
    }

    return entity;
  }

  async find(
    query: FindQuery<MathModel> = {},
    relations?: FindOptionsRelations<MathModel>
  ): Promise<PaginatedData<MathModel>> {
    const [content, total] = await AppDataSource.manager.findAndCount(
      MathModel,
      {
        relations,
        ...query,
      }
    );

    return { content, total };
  }

  async create(
    data: ParameterOf<typeof MathModel['new']>,
    relations?: FindOptionsRelations<MathModel>
  ): Promise<MathModel> {
    return AppDataSource.manager
      .save(MathModel.new(data))
      .then((entity) => this.findById({ id: entity.id }, relations));
  }

  async update(
    query: { id: string },
    data: Omit<Partial<MathModel>, 'id'>,
    relations?: FindOptionsRelations<MathModel>
  ): Promise<MathModel> {
    return AppDataSource.manager
      .update(MathModel, query, data)
      .then(() => this.findById({ id: query.id }, relations));
  }

  async remove(query: { id: string }): Promise<void> {
    await AppDataSource.manager.delete(MathModel, query);
  }
}
