import _ = require('lodash');
import CityMock from 'tests/mocks/CityMock';
import ViewInWindowMock from 'tests/mocks/ViewInWindowMock';
import { v4 } from 'uuid';

import AppDataSource from '@/data-source';

import Apartment from '@/domain/apartments/Apartment.model';
import ApartmentService from '@/domain/apartments/Apartment.service';

import ServerError from '@/lib/server-error/ServerError';

import { EntityType, ParameterOf } from '@/types';

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
          ServerError.cantFind({ entity: EntityType.APARTMENT })
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
        city: {
          name: testQuery.city.name,
        },
        floor: testQuery.floor,
        roomCount: testQuery.roomCount,
        isStudio: testQuery.isStudio,
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
            ServerError.cantFind({ entity: EntityType.APARTMENT })
          )
        );
    });
  });
});
