import { SortDirection, SortItem } from '@/types';

export const sortModelToOrder = (sort: SortItem[] = []) => {
  return sort.reduce<Record<string, SortDirection>>(
    (acc, item) => ({ ...acc, [item.field]: item.sort }),
    {}
  );
};
