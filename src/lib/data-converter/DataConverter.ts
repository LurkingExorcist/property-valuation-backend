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
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Between,
} from 'typeorm';

import { FILTER_OPERATORS } from '@/constants';

import {
  ElementType,
  FilterOperation,
  FilterOperator,
  FindQuery,
  Primitive,
  RestFindQuery,
  SortDirection,
  SortItem,
  Where,
} from '@/types';

import { ServerError } from '../server-error';

const equals = _.curry(_.isEqual);

export class DataConverter {
  static dataFrameToArray<
    T extends Record<string, unknown[]>,
    R extends { [K in keyof T]: ElementType<T[K]> }
  >(dataFrame: T): R[] {
    const result: R[] = [];
    const keys = Object.keys(dataFrame) as (keyof T)[];

    if (_.isNil(keys[0])) throw new Error('Неверный формат датафрейма');

    for (let i = 0; i < dataFrame[keys[0]].length; i++) {
      const record: R = {} as R;

      keys.forEach((key) => {
        record[key] = dataFrame[key][i] as R[keyof T];
      });

      result.push(record);
    }

    return result;
  }

  static sortModelToOrder(sort: SortItem[] = []): FindOptionsOrder<any> {
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
  }

  static whereToFindOptions<T>(where: Where<T>): FindOptionsWhere<any> {
    return _(where)
      .entries()
      .filter(([key, val]) => !_.isNil(val))
      .map(([key, val]) =>
        _.cond<Where<T[keyof T]> | FilterOperation, FindOptionsWhere<any>>([
          [
            _.isArray,
            _.partialRight(_.thru, ([op, value]: FilterOperation) => [
              key,
              _.cond<FilterOperator, FindOperator<T>>([
                [
                  equals(FILTER_OPERATORS.EQUALS),
                  () => Equal(value?.toString()),
                ],
                [
                  equals(FILTER_OPERATORS.LIKE),
                  () => ILike(`%${value?.toString()}%`),
                ],
                [
                  equals(FILTER_OPERATORS.LESS_THAN),
                  () => LessThan(value?.toString()),
                ],
                [
                  equals(FILTER_OPERATORS.LESS_THAN_EQUAL),
                  () => LessThanOrEqual(value?.toString()),
                ],
                [
                  equals(FILTER_OPERATORS.MORE_THEN),
                  () => MoreThan(value?.toString()),
                ],
                [
                  equals(FILTER_OPERATORS.MORE_THEN_EQUAL),
                  () => MoreThanOrEqual(value?.toString()),
                ],
                [equals(FILTER_OPERATORS.IS_EMPTY), () => IsNull()],
                [equals(FILTER_OPERATORS.IS_NOT_EMPTY), () => Not(IsNull())],
                [
                  equals(FILTER_OPERATORS.IS_ANY_OF),
                  () => {
                    if (!_.isArray(value)) {
                      throw ServerError.badRequest({
                        message: 'Значение должно быть массивом',
                      });
                    }

                    return In(value);
                  },
                ],
                [
                  equals(FILTER_OPERATORS.BETWEEN),
                  () => {
                    if (!_.isArray(value)) {
                      throw ServerError.badRequest({
                        message: 'Значение должно быть массивом',
                      });
                    }

                    return Between(value[0], value[1]);
                  },
                ],
                [
                  _.stubTrue,
                  (v) => {
                    throw ServerError.badRequest({
                      message: `Неверный тип операции "${v.toString()}"`,
                    });
                  },
                ],
              ])(op),
            ]),
          ],
          [_.isObject, (v) => [key, DataConverter.whereToFindOptions(v)]],
          [
            _.stubTrue,
            (v) => {
              throw ServerError.badRequest({
                message: `Неверный тип операции "${v.toString()}"`,
              });
            },
          ],
        ])(val as Where<T[keyof T]> | FilterOperation)
      )
      .fromPairs()
      .value();
  }

  static restQueryToORM<T>(query: RestFindQuery<T> = {}): FindQuery<T> {
    return {
      where: query.where && DataConverter.whereToFindOptions(query.where),
      take: query.pageSize,
      skip: (query.pageIndex || 0) * (query.pageSize || 0),
      order: DataConverter.sortModelToOrder(query.sort),
    };
  }
}
