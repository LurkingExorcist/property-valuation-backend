import { Injectable } from '@decorators/di';
import _ = require('lodash');
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';

import AppDataSource from '@/data-source';

import ServerError from '@/lib/server-error/ServerError';

import ICrudService from '@/interfaces/ICrudService';

import { EntityType, ParameterOf } from '@/types';

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
      throw ServerError.cantFind({ entity: EntityType.ACCESS_RIGHT });
    }

    return entity;
  }

  find(
    query: FindOptionsWhere<User> | FindOptionsWhere<User>[] = {},
    relations?: FindOptionsRelations<User>
  ): Promise<User[]> {
    return AppDataSource.manager.find(User, {
      relations,
      where: query,
    });
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
    return AppDataSource.manager
      .update(User, query, data)
      .then(() => this.findById({ id: query.id }, relations));
  }

  async remove(query: { id: string }): Promise<void> {
    await AppDataSource.manager.delete(User, query);
  }
}
