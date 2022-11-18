export type ElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ET> ? ET : never;

export type ObjectValueOf<T extends Record<string, unknown>> = T extends Record<
  string,
  infer V
>
  ? V
  : never;

export type ParameterOf<T extends (...args: any[]) => any> = Parameters<T>[0];

export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined;
