import _ = require('lodash');

import AccessRight from '@/domain/access-rights/AccessRight.model';
import AccessType from '@/domain/access-rights/types/AccessType';
import AppSection from '@/domain/app-sections/AppSection.model';

import { APP_SECTIONS } from '@/const';
import AppDataSource from '@/data-source';

const generateAccessRights = async () => {
  console.info('GENERATE ACCESS RIGHTS');
  console.info('script started');
  console.log();

  try {
    const entities = _.keys(APP_SECTIONS).map((sectionName) => {
      const appSection = AppSection.new({ name: sectionName });
      const accessRights = _.values(AccessType).map((accessType) => {
        const accessRight = AccessRight.new({
          appSection,
          accessType,
        });
        return accessRight;
      });

      return {
        appSection,
        accessRights,
      };
    });

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await Promise.all(
        entities.map(async ({ appSection, accessRights }, index, {length}) => {
          const foundAppSection = await queryRunner.manager.findOne(
            AppSection,
            {
              where: {
                name: appSection.name,
              },
            }
          );

          if (_.isNull(foundAppSection)) {
            await queryRunner.manager.insert(AppSection, appSection);
          }

          appSection = foundAppSection || appSection;

          await Promise.all(
            accessRights.map(async (entity) => {
              entity.appSection = appSection;

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
                await queryRunner.manager.insert(AccessRight, entity);
              }
            })
          );

          console.info(`${index+1} of ${length} is inserted`);
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

export default generateAccessRights;
