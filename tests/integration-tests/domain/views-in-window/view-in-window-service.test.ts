import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';

import { DOMAIN_ENTITY_TYPES } from '@/constants';

import { AppDataSource } from '@/data-source';
import { ViewInWindow, ViewInWindowService } from '@/domain';
import { ServerError } from '@/lib';
import { ParameterOf } from '@/types';

describe('ViewInWindow.service', () => {
  const service = new ViewInWindowService();

  let testEntity: ViewInWindow;
  let testQuery: ParameterOf<typeof ViewInWindow['new']>;

  beforeAll(() =>
    AppDataSource.initialize().then(async () => {
      testQuery = {
        name: faker.lorem.word(),
        description: faker.lorem.words(),
      };
    })
  );

  it('::create', async () => {
    await service.create(testQuery).then((instance) => {
      testEntity = instance;
      expect(instance).toBeInstanceOf(ViewInWindow);
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
          ServerError.cantFind({ entity: DOMAIN_ENTITY_TYPES.VIEW_IN_WINDOW })
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
          description: testQuery.description,
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
      name: faker.lorem.word(),
      description: faker.lorem.words(),
    };

    await service.update({ id: testEntity.id }, updateData).then((instance) => {
      expect(instance.name).toBe(updateData.name);
      expect(instance.description).toBe(updateData.description);
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
            ServerError.cantFind({ entity: DOMAIN_ENTITY_TYPES.VIEW_IN_WINDOW })
          )
        );
    });
  });
});
