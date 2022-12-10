import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';

import { FILTER_OPERATORS } from '@/constants';

import { ObjectValueOf, Primitive } from './utility';

export type SortDirection = 'asc' | 'desc' | undefined;
export type SortItem = {
  field: string;
  sort: SortDirection;
};

export type FilterOperator = ObjectValueOf<typeof FILTER_OPERATORS>;

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
