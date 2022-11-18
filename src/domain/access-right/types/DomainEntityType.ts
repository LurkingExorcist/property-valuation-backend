import { DOMAIN_ENTITY_TYPES } from '@/constants';

import { ObjectValueOf } from '@/types';

export type DomainEntityType = ObjectValueOf<typeof DOMAIN_ENTITY_TYPES>;
