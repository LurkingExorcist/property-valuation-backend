import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';

import { DOMAIN_ENTITY_TYPES } from '@/constants';

import { AppDataSource } from '@/data-source';
import { City, CityService } from '@/domain';
import { ServerError } from '@/lib';
import { ParameterOf } from '@/types';

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
        expect(e).toEqual(
          ServerError.cantFind({ entity: DOMAIN_ENTITY_TYPES.CITY })
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
          name: testQuery.name,
          region: testQuery.region,
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
          expect(e).toEqual(
            ServerError.cantFind({ entity: DOMAIN_ENTITY_TYPES.CITY })
          )
        );
    });
  });
});
