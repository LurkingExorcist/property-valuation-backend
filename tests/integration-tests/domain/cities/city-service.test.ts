import faker from '@faker-js/faker';
import { v4 } from 'uuid';

import AppDataSource from '@/data-source';

import City from '@/domain/cities/City.model';
import CityService from '@/domain/cities/City.service';

import ServerError from '@/lib/server-error/ServerError';

import { EntityType, ParameterOf } from '@/types';

describe('City.service', () => {
  const service = new CityService();

  let testEntity: City;
  let testQuery: ParameterOf<typeof City['new']>;

  beforeAll(() =>
    AppDataSource.initialize().then(async () => {
      testQuery = {
        name: faker.address.city(),
        region: faker.address.state(),
      };
    })
  );

  it('::create', async () => {
    await service.create(testQuery).then((instance) => {
      testEntity = instance;
      expect(instance).toBeInstanceOf(City);
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
        expect(e).toEqual(ServerError.cantFind({ entity: EntityType.CITY }))
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
        name: testQuery.name,
        region: testQuery.region,
      })
      .then((instances) => {
        expect(instances).toBeInstanceOf(Array);

        expect(
          instances.find((instance) => instance.id === testEntity.id)
        ).toMatchObject(testEntity);
      });
  });

  it('::update', async () => {
    const updateData = {
      name: faker.address.city(),
      region: faker.address.state(),
    };

    await service.update({ id: testEntity.id }, updateData).then((instance) => {
      expect(instance.name).toBe(updateData.name);
      expect(instance.region).toBe(updateData.region);
    });
  });

  it('::remove', async () => {
    await service.remove({ id: testEntity.id }).then(() => {
      service
        .findById({
          id: testEntity.id,
        })
        .catch((e) =>
          expect(e).toEqual(ServerError.cantFind({ entity: EntityType.CITY }))
        );
    });
  });
});
