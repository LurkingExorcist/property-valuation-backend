import ServerError from '@/lib/server-error/ServerError';
import _ = require('lodash');

import { Injectable } from '@decorators/di';
import { FindOptionsRelations } from 'typeorm';

import AppDataSource from '@/data-source';
import ICrudService from '@/interfaces/ICrudService';
import { EntityType } from '@/types';

import AppSection from '../app-sections/AppSection.model';

import AccessType from './types/AccessType';
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
    query: Record<string, unknown> = {},
    relations?: FindOptionsRelations<AccessRight>
  ): Promise<AccessRight[]> {
    return AppDataSource.manager.find(AccessRight, {
      relations,
      where: { ...query },
    });
  }

  async create(
    data: {
      appSection: AppSection;
      accessType: AccessType;
    },
    relations?: FindOptionsRelations<AccessRight>
  ): Promise<AccessRight> {
    return AppDataSource.manager
      .insert(AccessRight, AccessRight.new(data))
      .then((res) => res.identifiers[0].id as string)
      .then((id) => this.findById({ id }, relations));
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
