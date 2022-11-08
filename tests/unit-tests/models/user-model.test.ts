import { faker } from '@faker-js/faker';
import _ = require('lodash');

import { DOMAIN_ENTITY_TYPES } from '@/constants';

import { AccessRight, ACCESS_LEVELS, User } from '@/domain';

describe('User.model', () => {
  it('::new', () => {
    const user = User.new({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.number('+7 (900) ###-##-##'),
      password: faker.internet.password(),
      accessRights: _.range(5).map(() =>
        AccessRight.new({
          domainEntity: faker.helpers.objectValue(DOMAIN_ENTITY_TYPES),
          accessLevel: faker.helpers.objectValue(ACCESS_LEVELS),
        })
      ),
    });

    expect(user).toBeInstanceOf(User);
  });

  it('.checkPassword', () => {
    const password = faker.internet.password();
    const user = User.new({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.phoneNumber('+7 (900) ###-##-##'),
      password,
      accessRights: [],
    });

    expect(user.checkPassword(password)).toBe(true);
  });
});
