import { Injectable } from '@decorators/di';
import _ = require('lodash');
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';

import AppDataSource from '@/data-source';

import ServerError from '@/lib/server-error/ServerError';

import ICrudService from '@/interfaces/ICrudService';

import { EntityType, ParameterOf } from '@/types';

import AccessRight from './AccessRight.model';

@Injectable()
export default class AccessRightService implements ICrudService<AccessRight> {
  async findById(
    query: { id: string },
    relations?: FindOptionsRelations<AccessRight>
  ): Promise<AccessRight> {
    const entity = await AppDataSource.manager.findOne(AccessRight, {
      relations,
      where: { id: query.id },
    });

    if (_.isNull(entity)) {
      throw ServerError.cantFind({ entity: EntityType.ACCESS_RIGHT });
    }

    return entity;
  }

  find(
    query: FindOptionsWhere<AccessRight> | FindOptionsWhere<AccessRight>[] = {},
    relations?: FindOptionsRelations<AccessRight>
  ): Promise<AccessRight[]> {
    return AppDataSource.manager.find(AccessRight, {
      relations,
      where: query,
    });
  }

  async create(
    data: ParameterOf<typeof AccessRight['new']>,
    relations?: FindOptionsRelations<AccessRight>
  ): Promise<AccessRight> {
    return AppDataSource.manager
      .save(AccessRight.new(data))
      .then((entity) => this.findById({ id: entity.id }, relations));
  }

  async update(
    query: { id: string },
    data: Omit<Partial<AccessRight>, 'id'>,
    relations?: FindOptionsRelations<AccessRight>
  ): Promise<AccessRight> {
    return AppDataSource.manager
      .update(AccessRight, query, data)
      .then(() => this.findById({ id: query.id }, relations));
  }

  async remove(query: { id: string }): Promise<void> {
    await AppDataSource.manager.delete(AccessRight, query);
  }
}
