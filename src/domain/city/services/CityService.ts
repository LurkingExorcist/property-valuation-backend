import { Injectable } from '@decorators/di';
import _ = require('lodash');
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';

import { DOMAIN_ENTITY_TYPES } from '@/constants';

import { AppDataSource } from '@/data-source';
import { ICrudService } from '@/interfaces';
import { ServerError } from '@/lib';
import { FindQuery, PaginatedData, ParameterOf } from '@/types';

import { City } from '../models';

@Injectable()
export class CityService implements ICrudService<City> {
  async findById(
    query: { id: string },
    relations?: FindOptionsRelations<City>
  ): Promise<City> {
    const entity = await AppDataSource.manager.findOne(City, {
      relations,
      where: { id: query.id },
    });

    if (_.isNull(entity)) {
      throw ServerError.cantFind({ entity: DOMAIN_ENTITY_TYPES.CITY });
    }

    return entity;
  }

  async find(
    query: FindQuery<City> = {},
    relations?: FindOptionsRelations<City>
  ): Promise<PaginatedData<City>> {
    const [content, total] = await AppDataSource.manager.findAndCount(City, {
      relations,
      ...query,
    });

    return { content, total };
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

  async batchRemove(
    query: FindOptionsWhere<City>,
    relations?: FindOptionsRelations<City>
  ): Promise<void> {
    await AppDataSource.manager
      .find(City, {
        relations,
        where: query,
      })
      .then((cities) =>
        Promise.all(cities.map((city) => AppDataSource.manager.remove(city)))
      );
  }
}
