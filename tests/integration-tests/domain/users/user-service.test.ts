import { faker } from '@faker-js/faker';
import { AccessRightsMock } from 'tests/mocks';
import { v4 } from 'uuid';

import { DOMAIN_ENTITY_TYPES } from '@/constants';

import { AppDataSource } from '@/data-source';
import { User, UserService } from '@/domain';
import { ServerError } from '@/lib';
import { ParameterOf } from '@/types';

describe('User.service', () => {
  const service = new UserService();
  const accessRightsMock = new AccessRightsMock();

  let testEntity: User;

  let testQuery: ParameterOf<typeof User['new']>;

  beforeAll(() =>
    AppDataSource.initialize().then(async () => {
      await accessRightsMock.init();

      testQuery = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.phoneNumber('+7 (900) ###-##-##'),
        password: faker.internet.password(),
        accessRights: accessRightsMock.getAccessRights(),
      };
    })
  );

  afterAll(async () => {
    await accessRightsMock.clear();
  });

  it('::create', async () => {
    await service.create(testQuery).then((instance) => {
      testEntity = instance;
      expect(instance).toBeInstanceOf(User);
    });
  });

  it('::findById', async () => {
    await service
      .findById({
        id: testEntity.id,
      })
      .then((instance) => {
        expect(instance).toMatchObject(testEntity);
      });
  });

  it('::findById with error', async () => {
    await service
      .findById({
        id: v4(),
      })
      .catch((e) =>
        expect(e).toEqual(
          ServerError.cantFind({ entity: DOMAIN_ENTITY_TYPES.USER })
        )
      );
  });

  it('::find without query', async () => {
    await service.find().then((instances) => {
      expect(instances).toBeInstanceOf(Array);

      expect(
        instances.content.find((instance) => instance.id === testEntity.id)
      ).toMatchObject(testEntity);
    });
  });

  it('::find with query', async () => {
    await service
      .find({
        where: {
          username: testQuery.username,
          email: testQuery.email,
        },
      })
      .then((instances) => {
        expect(instances).toBeInstanceOf(Array);

        expect(
          instances.content.find((instance) => instance.id === testEntity.id)
        ).toMatchObject(testEntity);
      });
  });

  it('::update', async () => {
    const updateData = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.phoneNumber('+7 (900) ###-##-##'),
    };

    await service.update({ id: testEntity.id }, updateData).then((instance) => {
      expect(instance.username).toBe(updateData.username);
      expect(instance.email).toBe(updateData.email);
      expect(instance.phoneNumber).toBe(updateData.phoneNumber);
    });
  });

  it('::remove', async () => {
    await service.remove({ id: testEntity.id }).then(() => {
      service
        .findById({
          id: testEntity.id,
        })
        .catch((e) =>
          expect(e).toEqual(
            ServerError.cantFind({ entity: DOMAIN_ENTITY_TYPES.USER })
          )
        );
    });
  });
});
