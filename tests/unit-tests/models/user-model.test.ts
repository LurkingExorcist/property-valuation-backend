import faker from '@faker-js/faker';
import _ = require('lodash');

import AccessRight from '@/domain/access-rights/AccessRight.model';
import AccessType from '@/domain/access-rights/types/AccessType';
import AppSection from '@/domain/access-rights/types/AppSection';
import User from '@/domain/users/User.model';

describe('User.model', () => {
  it('::new', () => {
    const user = User.new({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.phoneNumber('+7 (900) ###-##-##'),
      password: faker.internet.password(),
      accessRights: _.range(5).map(() =>
        AccessRight.new({
          appSection: faker.random.objectElement(AppSection),
          accessType: faker.random.objectElement(AccessType),
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
