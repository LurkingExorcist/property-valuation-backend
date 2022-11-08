import { v4 } from 'uuid';

import { DOMAIN_ENTITY_TYPES } from '@/constants';

import { AppDataSource } from '@/data-source';
import { AccessRight, AccessRightService, ACCESS_LEVELS } from '@/domain';
import { ServerError } from '@/lib';

describe('AccessRight.service', () => {
  const service = new AccessRightService();
  let testEntity: AccessRight;

  beforeAll(() => AppDataSource.initialize());

  it('::create', async () => {
    await service
      .create({
        domainEntity: DOMAIN_ENTITY_TYPES.APARTMENT,
        accessLevel: ACCESS_LEVELS.READ,
      })
      .then((instance) => {
        testEntity = instance;
        expect(instance).toBeInstanceOf(AccessRight);
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
          ServerError.cantFind({ entity: DOMAIN_ENTITY_TYPES.ACCESS_RIGHT })
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
          domainEntity: DOMAIN_ENTITY_TYPES.APARTMENT,
          accessLevel: ACCESS_LEVELS.READ,
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
    await service
      .update(
        { id: testEntity.id },
        {
          domainEntity: DOMAIN_ENTITY_TYPES.CITY,
          accessLevel: ACCESS_LEVELS.WRITE,
        }
      )
      .then((instance) => {
        expect(instance.domainEntity).toBe(DOMAIN_ENTITY_TYPES.CITY);
        expect(instance.accessLevel).toBe(2);
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
            ServerError.cantFind({ entity: DOMAIN_ENTITY_TYPES.ACCESS_RIGHT })
          )
        );
    });
  });
});
