import _ = require('lodash');
import UserTokenMock from 'tests/mocks/UserTokenMock';
import { v4 } from 'uuid';

import AppDataSource from '@/data-source';

import AccessType from '@/domain/access-rights/types/AccessType';
import AppSection from '@/domain/access-rights/types/AppSection';
import AuthenticationService from '@/domain/authentication/Authentication.service';
import UserService from '@/domain/users/User.service';

import ServerError from '@/lib/server-error/ServerError';

import { ParameterOf } from '@/types';

describe('Authentication.service', () => {
  const userMock = new UserTokenMock({
    section: AppSection.CITIES,
    rights: [AccessType.READ, AccessType.WRITE],
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
