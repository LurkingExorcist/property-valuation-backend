import _ = require('lodash');
import { CityMock, ViewInWindowMock } from 'tests/mocks';
import { v4 } from 'uuid';

import { DOMAIN_ENTITY_TYPES } from '@/constants';

import { AppDataSource } from '@/data-source';
import { Apartment, ApartmentService } from '@/domain';
import { ServerError } from '@/lib';
import { ParameterOf } from '@/types';

describe('Apartment.service', () => {
  const service = new ApartmentService();
  const cityMock = new CityMock();
  const viewInWindowMock = new ViewInWindowMock();

  let testEntity: Apartment;

  let testQuery: ParameterOf<typeof Apartment['new']>;

  beforeAll(() =>
    AppDataSource.initialize().then(async () => {
      await cityMock.init();
      await viewInWindowMock.init();

      testQuery = {
        city: cityMock.getCity(),
        viewsInWindow: viewInWindowMock.getViewsInWindow(),
        floor: _.random(42),
        totalArea: _.random(42),
        livingArea: _.random(42),
        kitchenArea: _.random(42),
        roomCount: _.random(42),
        height: _.random(42),
        isStudio: Boolean(_.random()),
        totalPrice: _.random(1_000_000, 100_000_000),
      };
    })
  );

  afterAll(async () => {
    await cityMock.clear();
    await viewInWindowMock.clear();
  });

  it('::create', async () => {
    await service.create(testQuery).then((instance) => {
      testEntity = instance;
      expect(instance).toBeInstanceOf(Apartment);
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
          ServerError.cantFind({ entity: DOMAIN_ENTITY_TYPES.APARTMENT })
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
          city: {
            name: testQuery.city.name,
          },
          floor: testQuery.floor,
          roomCount: testQuery.roomCount,
          isStudio: testQuery.isStudio,
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
      floor: _.random(42),
      totalArea: _.random(42),
      livingArea: _.random(42),
      kitchenArea: _.random(42),
      roomCount: _.random(42),
      height: _.random(42),
      isStudio: Boolean(_.random()),
      totalPrice: _.random(1_000_000, 100_000_000),
    };

    await service.update({ id: testEntity.id }, updateData).then((instance) => {
      expect(instance.floor).toBe(updateData.floor);
      expect(instance.totalArea).toBe(updateData.totalArea);
      expect(instance.livingArea).toBe(updateData.livingArea);
      expect(instance.kitchenArea).toBe(updateData.kitchenArea);
      expect(instance.roomCount).toBe(updateData.roomCount);
      expect(instance.height).toBe(updateData.height);
      expect(instance.isStudio).toBe(updateData.isStudio);
      expect(instance.totalPrice).toBe(updateData.totalPrice);
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
            ServerError.cantFind({ entity: DOMAIN_ENTITY_TYPES.APARTMENT })
          )
        );
    });
  });
});
