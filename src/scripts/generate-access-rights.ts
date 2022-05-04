import 'dotenv/config';
import 'module-alias/register';
import _ = require('lodash');

import AccessRight from '@/domain/access-rights/AccessRight.model';
import AccessType from '@/domain/access-rights/types/AccessType';
import AppSection from '@/domain/access-rights/types/AppSection';

import AppDataSource from '@/data-source';

const generateAccessRights = async () => {
  console.info('GENERATE ACCESS RIGHTS');
  console.info('script started');
  console.log();

  try {
    const entities = _.keys(AppSection).map((appSection) => {
      return _.values(AccessType).map((accessType) => {
        const accessRight = AccessRight.new({
          appSection: appSection as AppSection,
          accessType,
        });
        return accessRight;
      });
    });

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
                    appSection: entity.appSection,
                    accessType: entity.accessType,
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
