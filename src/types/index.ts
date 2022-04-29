export type ElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ET> ? ET : never;

export enum EntityType {
  ACCESS_RIGHT,
  APARTMENT,
  APP_SECTION,
  USER,
  VIEW_IN_WINDOW,
}
