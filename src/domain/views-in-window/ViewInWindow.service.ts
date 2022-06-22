import { Injectable } from '@decorators/di';
import _ = require('lodash');
import { FindOptionsRelations } from 'typeorm';

import ServerError from '@/lib/server-error/ServerError';

import ICrudService from '@/interfaces/ICrudService';

import AppDataSource from '@/data-source';
import { EntityType, FindQuery, PaginatedData, ParameterOf } from '@/types';

import ViewInWindow from './ViewInWindow.model';

@Injectable()
export default class ViewInWindowService implements ICrudService<ViewInWindow> {
  async findById(
    query: { id: string },
    relations?: FindOptionsRelations<ViewInWindow>
  ): Promise<ViewInWindow> {
    const entity = await AppDataSource.manager.findOne(ViewInWindow, {
      relations,
      where: { id: query.id },
    });

    if (_.isNull(entity)) {
      throw ServerError.cantFind({ entity: EntityType.VIEW_IN_WINDOW });
    }

    return entity;
  }

  async find(
    query: FindQuery<ViewInWindow> = {},
    relations?: FindOptionsRelations<ViewInWindow>
  ): Promise<PaginatedData<ViewInWindow>> {
    const [content, total] = await AppDataSource.manager.findAndCount(
      ViewInWindow,
      {
        relations,
        ...query,
      }
    );

    return { content, total };
  }

  async create(
    data: ParameterOf<typeof ViewInWindow['new']>,
    relations?: FindOptionsRelations<ViewInWindow>
  ): Promise<ViewInWindow> {
    return AppDataSource.manager
      .save(ViewInWindow.new(data))
      .then((entity) => this.findById({ id: entity.id }, relations));
  }

  async update(
    query: { id: string },
    data: Omit<Partial<ViewInWindow>, 'id'>,
    relations?: FindOptionsRelations<ViewInWindow>
  ): Promise<ViewInWindow> {
    return AppDataSource.manager
      .update(ViewInWindow, query, data)
      .then(() => this.findById({ id: query.id }, relations));
  }

  async remove(query: { id: string }): Promise<void> {
    await AppDataSource.manager.delete(ViewInWindow, query);
  }
}
