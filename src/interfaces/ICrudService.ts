import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';

import IModel from './IModel';

export default interface ICrudService<T extends IModel> {
  findById(
    query: { id: string },
    relations?: FindOptionsRelations<T>
  ): Promise<T>;
  find(
    query?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    relations?: FindOptionsRelations<T>
  ): Promise<T[]>;
  create(data: Partial<T>, relations?: FindOptionsRelations<T>): Promise<T>;
  update(
    query: { id: string },
    data: Omit<Partial<T>, 'id'>,
    relations?: FindOptionsRelations<T>
  ): Promise<T>;
  remove(query: { id: string }): Promise<void>;
}
