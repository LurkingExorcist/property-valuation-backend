import 'dotenv/config';
import 'module-alias/register';
import _ = require('lodash');

import { DOMAIN_ENTITY_TYPES } from '@/constants';

import { AppDataSource } from '@/data-source';
import { AccessRight, ACCESS_LEVELS, DomainEntityType } from '@/domain';

const generateAccessRights = async () => {
  console.info('GENERATE ACCESS RIGHTS');
  console.info('script started');
  console.log();

  try {
    const entities = _.values(DOMAIN_ENTITY_TYPES).map((domainEntity) =>
      _.values(ACCESS_LEVELS).map((accessLevel) =>
        AccessRight.new({
          domainEntity,
          accessLevel,
        })
      )
    );

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await Promise.all(
        entities.map(async (accessRights, index, { length }) => {
          await Promise.all(
            accessRights.map(async (entity) => {
              const foundAccessRight = await queryRunner.manager.findOne(
                AccessRight,
                {
                  where: {
                    domainEntity: entity.domainEntity,
                    accessLevel: entity.accessLevel,
                  },
                }
              );

              if (_.isNull(foundAccessRight)) {
                await queryRunner.manager.save(entity);
              }
            })
          );

          console.info(`${index + 1} of ${length} is saved`);
        })
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      console.error(err);

      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  } catch (err) {
    console.error(err);
  } finally {
    console.log();
    console.info('script ended');
  }
};

AppDataSource.initialize()
  .then(generateAccessRights)
  .catch((error) => console.error(error));
