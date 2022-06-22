import { Injectable } from '@decorators/di';
import _ = require('lodash');
import { FindOptionsRelations } from 'typeorm';

import ServerError from '@/lib/server-error/ServerError';

import ICrudService from '@/interfaces/ICrudService';

import AppDataSource from '@/data-source';
import { EntityType, FindQuery, PaginatedData, ParameterOf } from '@/types';

import User from './User.model';

@Injectable()
export default class UserService implements ICrudService<User> {
  async findById(
    query: { id: string },
    relations?: FindOptionsRelations<User>
  ): Promise<User> {
    const entity = await AppDataSource.manager.findOne(User, {
      relations,
      where: { id: query.id },
    });

    if (_.isNull(entity)) {
      throw ServerError.cantFind({ entity: EntityType.USER });
    }

    return entity;
  }

  async find(
    query: FindQuery<User> = {},
    relations?: FindOptionsRelations<User>
  ): Promise<PaginatedData<User>> {
    const [content, total] = await AppDataSource.manager.findAndCount(User, {
      relations,
      ...query,
    });

    return { content, total };
  }

  async create(
    data: ParameterOf<typeof User['new']>,
    relations?: FindOptionsRelations<User>
  ): Promise<User> {
    return AppDataSource.manager
      .save(User.new(data))
      .then((entity) => this.findById({ id: entity.id }, relations));
  }

  async update(
    query: { id: string },
    data: Omit<Partial<User>, 'id'>,
    relations?: FindOptionsRelations<User>
  ): Promise<User> {
    const { accessRights } = data;
    const omitedData = _.omit(data, 'accessRights');

    if (!_.isNil(accessRights)) {
      const user = await this.findById({ id: query.id }, relations);

      const actualRelationships = await AppDataSource.getRepository(User)
        .createQueryBuilder()
        .relation(User, 'accessRights')
        .of(user)
        .loadMany();

      await AppDataSource.getRepository(User)
        .createQueryBuilder()
        .relation(User, 'accessRights')
        .of(user)
        .addAndRemove(data.accessRights, actualRelationships);

      if (_.isEmpty(omitedData)) {
        return this.findById({ id: query.id }, relations);
      }
    }

    return AppDataSource.manager
      .update(User, query, omitedData)
      .then(() => this.findById({ id: query.id }, relations));
  }

  async remove(query: { id: string }): Promise<void> {
    await AppDataSource.manager.delete(User, query);
  }
}
