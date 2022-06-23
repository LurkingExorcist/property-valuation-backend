import _ = require('lodash');
import {
  Equal,
  IsNull,
  ILike,
  Not,
  In,
  FindOptionsOrder,
  FindOptionsWhere,
  FindOperator,
} from 'typeorm';

import {
  FilterOperation,
  FindQuery,
  RestFindQuery,
  SortDirection,
  SortItem,
  Where,
} from '@/types';

export const sortModelToOrder = (
  sort: SortItem[] = []
): FindOptionsOrder<any> => {
  return _(
    sort.reduce<Record<string, SortDirection>>(
      (acc, item) => ({ ...acc, [item.field]: item.sort }),
      {}
    )
  )
    .entries()
    .map(
      (entry) =>
        _.entries(_.set<FindOptionsOrder<any>>({}, entry[0], entry[1]))[0]
    )
    .fromPairs()
    .value();
};

const equals = _.curry(_.isEqual);

export const whereToFindOptions = <T>(
  where: Where<T>
): FindOptionsWhere<any> => {
  return _(where)
    .entries()
    .filter(([key, [op, value]]) => !_.isNil(value))
    .map(
      ([key, [op, value]]) =>
        [
          key,
          _.cond<FilterOperation, FindOperator<T>>([
            [equals(FilterOperation.CONTAINS), () => ILike(`%${value}%`)],
            [equals(FilterOperation.EQUALS), () => Equal(value)],
            [equals(FilterOperation.STARTS_WITH), () => ILike(`${value}%`)],
            [equals(FilterOperation.ENDS_WITH), () => ILike(`%${value}`)],
            [equals(FilterOperation.IS_EMPTY), () => IsNull()],
            [equals(FilterOperation.IS_NOT_EMPTY), () => Not(IsNull())],
            [equals(FilterOperation.IS_ANY_OF), () => In(value as string[])],
          ])(op),
        ] as const
    )
    .map(
      (entry) =>
        _({}).set<FindOptionsOrder<T>>(entry[0], entry[1]).entries().value()[0]
    )
    .fromPairs()
    .value();
};

export const restQueryToORM = <T>(
  query: RestFindQuery<T> = {}
): FindQuery<T> => {
  return {
    where: query.where && whereToFindOptions(query.where),
    take: query.pageSize,
    skip: (query.pageIndex || 0) * (query.pageSize || 0),
    order: sortModelToOrder(query.sort),
  };
};
