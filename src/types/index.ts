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
