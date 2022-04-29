import { Injectable } from '@decorators/di';
import { FindOptionsRelations } from 'typeorm';

import ServerError from '@/lib/server-error/ServerError';

import AppDataSource from '@/data-source';
import ICrudService from '@/interfaces/ICrudService';
import { EntityType } from '@/types';

import AppSection from './AppSection.model';
import _ = require('lodash');

@Injectable()
export default class AppSectionService implements ICrudService<AppSection> {
  async findById(
    query: { id: string },
    relations?: FindOptionsRelations<AppSection>
  ): Promise<AppSection> {
    const entity = await AppDataSource.manager.findOne(AppSection, {
      relations,
      where: { id: query.id },
    });

    if (_.isNull(entity)) {
      throw ServerError.cantFind({ entity: EntityType.ACCESS_RIGHT });
    }

    return entity;
  }

  find(
    query: Record<string, unknown>,
    relations?: FindOptionsRelations<AppSection>
  ): Promise<AppSection[]> {
    throw new Error('Method not implemented.');
  }

  create(data: Partial<AppSection>): Promise<AppSection> {
    throw new Error('Method not implemented.');
  }

  update(
    query: { id: string },
    data: Omit<Partial<AppSection>, 'id'>
  ): Promise<AppSection> {
    throw new Error('Method not implemented.');
  }

  remove(query: { id: string }): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
