import { DOMAIN_ENTITY_TYPES } from '@/constants';

import { AccessRight } from '@/domain';

describe('AccessRight.model', () => {
  it('::new', () => {
    const domainEntity = DOMAIN_ENTITY_TYPES.APARTMENT;
    const accessLevel = 2;

    const accessRight = AccessRight.new({
      domainEntity,
      accessLevel,
    });

    expect(accessRight).toBeInstanceOf(AccessRight);
  });
});
