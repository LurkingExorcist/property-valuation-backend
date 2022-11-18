import { ElementType } from '@/types';

import { DATASET_TABLE_COLUMNS, DATASET_VIEW_COLUMNS } from '../constants';

export type DatasetViewColumn = ElementType<typeof DATASET_VIEW_COLUMNS>;
export type DatasetTableColumn = ElementType<typeof DATASET_TABLE_COLUMNS>;
