import { FindOptionsRelations } from 'typeorm';

import { FindQuery, PaginatedData } from '@/types';

import { IModel } from './IModel';

export interface ICrudService<T extends IModel> {
  findById(
    query: { id: string },
    relations?: FindOptionsRelations<T>
  ): Promise<T>;
  find(
    query?: FindQuery<T>,
    relations?: FindOptionsRelations<T>
  ): Promise<PaginatedData<T>>;
  create(data: Partial<T>): Promise<T>;
  update(
    query: { id: string },
    data: Omit<Partial<T>, 'id'>,
    relations?: FindOptionsRelations<T>
  ): Promise<T>;
  remove(query: { id: string }): Promise<void>;
}
