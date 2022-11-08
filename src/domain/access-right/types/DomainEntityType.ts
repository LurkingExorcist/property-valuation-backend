import { DOMAIN_ENTITY_TYPES } from '@/constants';

import { ValueOf } from '@/types';

export type DomainEntityType = ValueOf<typeof DOMAIN_ENTITY_TYPES>;
