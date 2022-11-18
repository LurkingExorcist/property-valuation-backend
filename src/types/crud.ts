import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';

import { Primitive } from './utility';

export declare type SortDirection = 'asc' | 'desc' | undefined;
export type SortItem = {
  field: string;
  sort: SortDirection;
};

export enum FilterOperator {
  CONTAINS = 'contains',
  EQUALS = 'equals',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith',
  IS_EMPTY = 'isEmpty',
  IS_NOT_EMPTY = 'isNotEmpty',
  IS_ANY_OF = 'isAnyOf',
}

export type FilterOperation = [FilterOperator, Primitive | Primitive[]];

export type Where<T> = {
  [K in keyof T]?: Where<T[K]> | FilterOperation;
};

export type RestFindQuery<T> = {
  where?: Where<T>;
  sort?: SortItem[];
  pageSize?: number;
  pageIndex?: number;
};

export type FindQuery<T> = {
  where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  order?: FindOptionsOrder<T>;
  take?: number;
  skip?: number;
};

export type PaginatedData<T> = {
  content: T[];
  total: number;
};
