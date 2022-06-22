import { FindOptionsWhere } from 'typeorm';

export type ElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ET> ? ET : never;

// eslint-disable-next-line
export type ParameterOf<T extends (...args: any[]) => any> = Parameters<T>[0];

export enum EntityType {
  ACCESS_RIGHT,
  APARTMENT,
  CITY,
  USER,
  VIEW_IN_WINDOW,
}

export declare type SortDirection = 'asc' | 'desc' | null | undefined;
export type SortItem = {
  field: string;
  sort: SortDirection;
};

export type FindQuery<T> = {
  where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  sort?: SortItem[];
  pageSize?: number;
  pageIndex?: number;
};

export type PaginatedData<T> = {
  content: T[];
  total: number;
};
