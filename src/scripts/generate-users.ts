import 'dotenv/config';
import 'module-alias/register';
import { faker } from '@faker-js/faker';
import _ = require('lodash');

import { AppDataSource } from '@/data-source';
import { AccessRight, User } from '@/domain';

const generateUsers = async () => {
  console.info('GENERATE USERS');
  console.info('script started');
  console.log();

  try {
    const accessRights = await AppDataSource.manager.find(AccessRight);

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await Promise.resolve(
        User.new({
          username: 'admin',
          email: 'admin@property-evaluation.study',
          phoneNumber: '+79991556683',
          password: 'password',
          accessRights,
        })
      ).then(async (admin) => {
        await queryRunner.manager.save(admin);

        console.info(`admin user record is saved`);
      });

      await Promise.all(
        _.range(1, 10)
          .map(() =>
            User.new({
              username: faker.internet.userName(),
              email: faker.internet.email(),
              phoneNumber: faker.phone.number('+7 (900) ###-##-##'),
              password: 'password',
              accessRights: _.sampleSize(
                accessRights,
                _.random(accessRights.length)
              ),
            })
          )
          .map(async (user, index, { length }) => {
            await queryRunner.manager.save(user);
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
  .then(generateUsers)
  .catch((error) => console.error(error));
