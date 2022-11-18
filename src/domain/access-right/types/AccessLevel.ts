import { ObjectValueOf } from '@/types';

import { ACCESS_LEVELS } from '../constants';

export type AccessLevel = ObjectValueOf<typeof ACCESS_LEVELS>;
