import { Injectable } from '@decorators/di';
import _ = require('lodash');
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';

import AppDataSource from '@/data-source';

import ServerError from '@/lib/server-error/ServerError';

import ICrudService from '@/interfaces/ICrudService';

import { EntityType, ParameterOf } from '@/types';

import Apartment from './Apartment.model';

@Injectable()
export default class ApartmentService implements ICrudService<Apartment> {
  async findById(
    query: { id: string },
    relations?: FindOptionsRelations<Apartment>
  ): Promise<Apartment> {
    const entity = await AppDataSource.manager.findOne(Apartment, {
      relations,
      where: { id: query.id },
    });

    if (_.isNull(entity)) {
      throw ServerError.cantFind({ entity: EntityType.APARTMENT });
    }

    return entity;
  }

  find(
    query: FindOptionsWhere<Apartment> | FindOptionsWhere<Apartment>[] = {},
    relations?: FindOptionsRelations<Apartment>
  ): Promise<Apartment[]> {
    return AppDataSource.manager.find(Apartment, {
      relations,
      where: query,
    });
  }

  async create(
    data: ParameterOf<typeof Apartment['new']>,
    relations?: FindOptionsRelations<Apartment>
  ): Promise<Apartment> {
    return AppDataSource.manager
      .save(Apartment.new(data))
      .then((entity) => this.findById({ id: entity.id }, relations));
  }

  async update(
    query: { id: string },
    data: Omit<Partial<Apartment>, 'id'>,
    relations?: FindOptionsRelations<Apartment>
  ): Promise<Apartment> {
    const { viewsInWindow } = data;
    const omitedData = _.omit(data, 'viewsInWindow');

    if (!_.isNil(viewsInWindow)) {
      const apartment = await this.findById({ id: query.id }, relations);

      const actualRelationships = await AppDataSource.getRepository(Apartment)
        .createQueryBuilder()
        .relation(Apartment, 'viewsInWindow')
        .of(apartment)
        .loadMany();

      await AppDataSource.getRepository(Apartment)
        .createQueryBuilder()
        .relation(Apartment, 'viewsInWindow')
        .of(apartment)
        .addAndRemove(data.viewsInWindow, actualRelationships);

      if (_.isEmpty(omitedData)) {
        return this.findById({ id: query.id }, relations);
      }
    }

    return AppDataSource.manager
      .update(Apartment, query, _.omit(data, 'viewsInWindow'))
      .then(() => this.findById({ id: query.id }, relations));
  }

  async remove(query: { id: string }): Promise<void> {
    await AppDataSource.manager.delete(Apartment, query);
  }
}
