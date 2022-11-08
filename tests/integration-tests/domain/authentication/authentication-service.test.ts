import _ = require('lodash');
import { UserTokenMock } from 'tests/mocks';
import { v4 } from 'uuid';

import { DOMAIN_ENTITY_TYPES } from '@/constants';

import { AppDataSource } from '@/data-source';
import { AuthenticationService, UserService } from '@/domain';
import { ServerError } from '@/lib';
import { ParameterOf } from '@/types';

describe('Authentication.service', () => {
  const userMock = new UserTokenMock({
    domainEntity: DOMAIN_ENTITY_TYPES.USER,
    accessLevel: 2,
  });

  const service = new AuthenticationService(new UserService());

  let testQuery: ParameterOf<AuthenticationService['signin']>;

  beforeAll(async () => {
    await AppDataSource.initialize();
    await userMock.init();

    testQuery = {
      username: userMock.getUser().username,
      password: userMock.getPassword(),
    };
  });

  afterAll(async () => {
    await userMock.clear();
  });

  it('::signin', async () => {
    await service.signin(testQuery).then((instance) => {
      expect(_.isString(instance)).toBe(true);
    });
  });

  it('::signin with wrong password', async () => {
    await service
      .signin({ ...testQuery, password: v4() })
      .catch((e) => expect(e).toEqual(ServerError.cantAuthenticate()));
  });

  it('::signin with wrong username', async () => {
    await service
      .signin({ ...testQuery, username: v4() })
      .catch((e) => expect(e).toEqual(ServerError.cantAuthenticate()));
  });
});
