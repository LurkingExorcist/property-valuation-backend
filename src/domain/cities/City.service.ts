import { Injectable } from '@decorators/di';
import _ = require('lodash');
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';

import AppDataSource from '@/data-source';

import ServerError from '@/lib/server-error/ServerError';

import ICrudService from '@/interfaces/ICrudService';

import { EntityType, ParameterOf } from '@/types';

import City from './City.model';

@Injectable()
export default class CityService implements ICrudService<City> {
  async findById(
    query: { id: string },
    relations?: FindOptionsRelations<City>
  ): Promise<City> {
    const entity = await AppDataSource.manager.findOne(City, {
      relations,
      where: { id: query.id },
    });

    if (_.isNull(entity)) {
      throw ServerError.cantFind({ entity: EntityType.CITY });
    }

    return entity;
  }

  find(
    query: FindOptionsWhere<City> | FindOptionsWhere<City>[] = {},
    relations?: FindOptionsRelations<City>
  ): Promise<City[]> {
    return AppDataSource.manager.find(City, {
      relations,
      where: query,
    });
  }

  async create(
    data: ParameterOf<typeof City['new']>,
    relations?: FindOptionsRelations<City>
  ): Promise<City> {
    return AppDataSource.manager
      .save(City.new(data))
      .then((entity) => this.findById({ id: entity.id }, relations));
  }

  async update(
    query: { id: string },
    data: Omit<Partial<City>, 'id'>,
    relations?: FindOptionsRelations<City>
  ): Promise<City> {
    return AppDataSource.manager
      .update(City, query, data)
      .then(() => this.findById({ id: query.id }, relations));
  }

  async remove(query: { id: string }): Promise<void> {
    await AppDataSource.manager.delete(City, query);
  }
}
