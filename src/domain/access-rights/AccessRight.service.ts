import { Injectable } from '@decorators/di';
import _ = require('lodash');
import { FindOptionsRelations } from 'typeorm';

import ServerError from '@/lib/server-error/ServerError';
import { sortModelToOrder } from '@/lib/utils';

import ICrudService from '@/interfaces/ICrudService';

import AppDataSource from '@/data-source';
import { EntityType, FindQuery, PaginatedData, ParameterOf } from '@/types';

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

  async find(
    query: FindQuery<AccessRight> = {},
    relations?: FindOptionsRelations<AccessRight>
  ): Promise<PaginatedData<AccessRight>> {
    const [content, total] = await AppDataSource.manager.findAndCount(
      AccessRight,
      {
        relations,
        where: query.where,
        take: query.pageSize,
        skip: (query.pageIndex || 0) * (query.pageSize || 0),
        order: sortModelToOrder(query.sort),
      }
    );

    return { content, total };
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
