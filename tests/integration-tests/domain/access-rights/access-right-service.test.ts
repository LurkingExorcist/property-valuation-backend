import { v4 } from 'uuid';

import AppDataSource from '@/data-source';

import AccessRight from '@/domain/access-rights/AccessRight.model';
import AccessRightService from '@/domain/access-rights/AccessRight.service';
import AccessType from '@/domain/access-rights/types/AccessType';
import AppSection from '@/domain/access-rights/types/AppSection';

import ServerError from '@/lib/server-error/ServerError';

import { EntityType } from '@/types';

describe('AccessRight.service', () => {
  const service = new AccessRightService();
  let testEntity: AccessRight;

  beforeAll(() => AppDataSource.initialize());

  it('::create', async () => {
    await service
      .create({
        appSection: AppSection.APARTMENTS,
        accessType: AccessType.READ,
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
          ServerError.cantFind({ entity: EntityType.ACCESS_RIGHT })
        )
      );
  });

  it('::find without query', async () => {
    await service.find().then((instances) => {
      expect(instances).toBeInstanceOf(Array);

      expect(
        instances.find((instance) => instance.id === testEntity.id)
      ).toMatchObject(testEntity);
    });
  });

  it('::find with query', async () => {
    await service
      .find({
        appSection: AppSection.APARTMENTS,
        accessType: AccessType.READ,
      })
      .then((instances) => {
        expect(instances).toBeInstanceOf(Array);

        expect(
          instances.find((instance) => instance.id === testEntity.id)
        ).toMatchObject(testEntity);
      });
  });

  it('::update', async () => {
    await service
      .update(
        { id: testEntity.id },
        {
          appSection: AppSection.CITIES,
          accessType: AccessType.WRITE,
        }
      )
      .then((instance) => {
        expect(instance.appSection).toBe(AppSection.CITIES);
        expect(instance.accessType).toBe(AccessType.WRITE);
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
            ServerError.cantFind({ entity: EntityType.ACCESS_RIGHT })
          )
        );
    });
  });
});
