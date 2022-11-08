export type ElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ET> ? ET : never;

export type ValueOf<T extends Record<string, unknown>> = T extends Record<
  string,
  infer V
>
  ? V
  : never;

export type ParameterOf<T extends (...args: any[]) => any> = Parameters<T>[0];
